import net, { Socket, Server } from 'net';
import assert from 'assert';
import { Flap } from './types';
import { buildFlap } from './serverFlaps';
import { matchSnac, authKeyResponseSnac } from './serverSnacs';
import {
    parseFlap,
    parseSnac,
    parseAuthRequest,
    parseMD5LoginRequest,
} from './parsers';

interface AIMAuthServerOpts {
    port?: number;
    host?: string;
}

const defaults: AIMAuthServerOpts = {
    port: 5190,
};

export class AIMAuthServer {
    private server: Server;

    constructor(private opts: AIMAuthServerOpts = defaults) {
        this.server = net.createServer(this.onNewConnection.bind(this));
        this.server.on('error', this.onServerError.bind(this));
    }

    private onServerError(error: Error) {
        console.error('Server Error: ', error);
    }

    /**
     * @see http://web.archive.org/web/20080308233204/http://dev.aol.com/aim/oscar/#FLAP__SIGNON_FRAME
     */
    private onNewConnection(socket: Socket) {
        const address = socket.remoteAddress;
        const port = socket.remotePort;
        console.log(`AIMAuthServer: New connection from ${address}:${port}`);

        socket.once('connect', () => console.log('new socket connection'));
        socket.on('error', () => console.log('socket error'));
        socket.on('end', () => console.log('socked closed'));
        socket.on('close', () => console.log('socket closed'));
        socket.on('data', (data) => this.onSocketData(data, socket));

        socket.write(
            buildFlap({
                channel: 1,
                sequence: 1, // TODO: Sequence should be generated in an abstraction around socket.write
                data: Buffer.from([0x1]), // Flap version 1
            }),
        );

        // TODO: Setup state for the connection
        // Need to track some things, including the
        // salt/challenge for hashed passwords
    }

    private onChannel1(flap: Flap, socket: Socket) {
        const flapVersion = flap.data.readUInt32BE(0);
        assert(flapVersion === 0x1, 'Incorrect client FLAP version');
    }

    private onChannel2(flap: Flap, socket: Socket) {
        const snac = parseSnac(flap.data);

        if (matchSnac(snac, 'AUTH', 'MD5_AUTH_REQUEST')) {
            const authReq = parseAuthRequest(snac.data);
            // Can be _any_ server generated string with len < size of u32 int
            const authKey = Math.round(Math.random() * 1000).toString();
            const responseFlap = buildFlap({
                channel: 2,
                sequence: 2,
                data: authKeyResponseSnac(authKey, snac.requestID),
            });

            socket.write(responseFlap);
            return;
        }

        if (matchSnac(snac, 'AUTH', 'LOGIN_REQUEST')) {
            const payload = parseMD5LoginRequest(snac.data);
            console.log(payload);
            // TODO: Validate credentials, then send SNAC 17 03
            // http://iserverd1.khstu.ru/oscar/snac_17_03.html
            return;
        }

        console.log('Unhandled Channel 2 Flap: ', flap);
    }

    private onChannel3(flap: Flap, socket: Socket) {
        console.log('Channel 3 Flap: ', flap);
    }

    private onChannel4(flap: Flap, socket: Socket) {
        console.log('Channel 4 Flap: ', flap);
    }

    private onChannel5(flap: Flap, socket: Socket) {
        console.log('Channel 5 Flap: ', flap);
    }

    private onSocketData(data: Buffer, socket: Socket) {
        const flap = parseFlap(data);
        const handlers: ChannelHandlers = {
            1: this.onChannel1,
            2: this.onChannel2,
            3: this.onChannel3,
            4: this.onChannel4,
            5: this.onChannel5,
        };
        const handler = handlers[flap.channel];

        if (!handler) {
            console.warn(
                `AIMAuthServer: Unrecognized FLAP channel "${flap.channel}"`,
                flap,
            );
            return;
        }

        handler.call(this, flap, socket);
    }

    listen() {
        const { port, host } = this.opts;
        this.server.listen(port, host, () => {
            console.log(`AIMAuthServer: Listening on ${port}`);
        });
    }
}

/**
 * @see http://web.archive.org/web/20080308233204/http://dev.aol.com/aim/oscar/#FLAP__FRAME_TYPE
 */
interface ChannelHandlers {
    [key: number]: (flap: Flap, socket: Socket) => void;
}
