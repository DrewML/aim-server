import assert from 'assert';
import { Flap, FlapType } from './types';
import { buildFlap, parseFlaps } from './flapUtils';
import { createServer, Socket, Server, AddressInfo } from 'net';
import { MultiMap } from './MultiMap';

interface OscarServerOpts {
    port: number;
    host: string;
}

export class OscarServer {
    private server: Server;
    private host: string;
    private port: number;

    constructor(opts: OscarServerOpts) {
        this.host = opts.host;
        this.port = opts.port;

        this.server = createServer((socket) => {
            this.onConnection(new OscarSocket(socket));
        }).on('error', this.onServerError.bind(this));
    }

    onConnection(oscarSocket: OscarSocket) {
        throw new Error('onConnection not implemented');
    }

    onServerError(err: Error) {
        throw err;
    }

    start(): Promise<AddressInfo> {
        return new Promise((res) => {
            this.server.listen(this.port, this.host, () => {
                const address = this.server.address();
                assert(address && typeof address !== 'string');
                res(address);
            });
        });
    }

    stop(cb: (err?: Error) => void) {
        this.server.close(cb);
    }
}

interface FlapListener {
    (flap: Flap): void;
}

export class OscarSocket {
    private sequenceID = 0;
    private flapListeners = new MultiMap<number, FlapListener>();

    constructor(private socket: Socket) {
        socket.on('data', this.onData.bind(this));
        socket.on('error', (e) => console.error(e));
    }

    get remoteAddress() {
        return {
            host: this.socket.remoteAddress,
            port: this.socket.remotePort,
        };
    }

    /**
     * @summary Send the FLAP version number (always 0x1).
     *          OSCAR clients will not start sending flaps
     *          until the start FLAP is sent from the server
     */
    sendStartFlap() {
        this.write({
            type: 1,
            data: Buffer.from([0x0, 0x0, 0x0, 0x1]),
        });
    }

    write(flap: { type: FlapType; data: Buffer }) {
        const fullFlap = {
            ...flap,
            sequence: this.sequenceID++,
        };
        this.socket.write(buildFlap(fullFlap));
    }

    onFlap(type: FlapType, listener: FlapListener) {
        this.flapListeners.set(type, listener);
        return this;
    }

    private onData(data: Buffer) {
        for (const flap of parseFlaps(data)) {
            assert(
                this.flapListeners.has(flap.type),
                `No handler for Flap type ${flap.type}`,
            );
            const listeners = this.flapListeners.get(flap.type);
            for (const listener of listeners) {
                listener(flap);
            }
        }
    }
}
