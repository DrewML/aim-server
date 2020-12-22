import assert from 'assert';
import { Flap } from './types';
import { parseFlap, buildFlap } from './flapUtils';
import { createServer, Socket, Server, AddressInfo } from 'net';
import { MultiMap } from './MultiMap';

interface OscarServerOpts {
    port?: number;
    host?: string;
}

export class OscarServer {
    private server: Server;
    private host: string;
    private port: number;

    constructor(opts: OscarServerOpts) {
        this.host = opts.host ?? '0.0.0.0';
        this.port = opts.port ?? 5190;

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

interface ChannelListener {
    (flap: Flap): void;
}

export class OscarSocket {
    private sequenceID = 0;
    private channelListeners = new MultiMap<number, ChannelListener>();

    constructor(private socket: Socket) {
        socket.on('data', this.onData.bind(this));
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
     *          until the start FLAP is sent
     */
    sendStartFlap() {
        this.write({
            channel: 1,
            data: Buffer.from([0x1]),
        });
    }

    write(flap: { channel: number; data: Buffer }) {
        const fullFlap = {
            ...flap,
            sequence: this.sequenceID++,
        };
        this.socket.write(buildFlap(fullFlap));
    }

    onChannel(channel: number, listener: ChannelListener) {
        this.channelListeners.set(channel, listener);
        return this;
    }

    private onData(data: Buffer) {
        const flap = parseFlap(data);
        const listeners = this.channelListeners.get(flap.channel);
        for (const listener of listeners) {
            listener(flap);
        }
    }
}
