import net, { Socket } from 'net';
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

const server = net.createServer((socket) => {
    console.log('New socket opened');

    socket.on('end', () => {
        console.log('client disconnected');
    });

    socket.on('connect', () => console.log('Socket connected'));
    socket.on('error', (e) => console.log('Socket error', e));
    socket.on('close', () => {
        console.log('socket closed');
    });

    /**
     * @see http://web.archive.org/web/20080308233204/http://dev.aol.com/aim/oscar/#FLAP__FRAME_TYPE
     */
    const handlers: ChannelHandlers = {
        1: onChannel1Message,
        2: onChannel2Message,
        3: onChannel3Message,
        4: onChannel4Message,
        5: onChannel5Message,
    };

    socket.on('data', (buf) => {
        const flap = parseFlap(buf);
        const handler = handlers[flap.channel];

        if (!handler) {
            console.warn(`Unrecognized FLAP channel "${flap.channel}"`, flap);
            return;
        }

        handler(flap, socket);
    });

    /**
     * @see http://web.archive.org/web/20080308233204/http://dev.aol.com/aim/oscar/#FLAP__SIGNON_FRAME
     */
    socket.write(
        buildFlap({
            channel: 1,
            sequence: 1,
            data: Buffer.from([0x1]), // Flap version 1
        }),
    );
});

server.on('error', (err) => {
    console.error('Server crashed. Welp');
    console.error(err);
    process.exit(1);
});

server.listen(5190, () => {
    console.log('Oscar Auth Server listening on 5190');
});

/**
 * @see http://web.archive.org/web/20080308233204/http://dev.aol.com/aim/oscar/#FLAP__FRAME_TYPE
 */
interface ChannelHandlers {
    [key: number]: (flap: Flap, socket: Socket) => void;
}

function onChannel1Message(flap: Flap) {
    const flapVersion = flap.data.readUInt32BE(0);
    assert(flapVersion === 0x1, 'Incorrect client FLAP version');
}

function onChannel2Message(flap: Flap, socket: Socket) {
    console.log('Channel 2 Flap: ', flap);
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
        // TODO: Validate credentials, then send SNAC 17 03
        // http://iserverd1.khstu.ru/oscar/snac_17_03.html
        return;
    }
}

function onChannel3Message(flap: Flap) {
    console.log('Channel 3 Flap: ', flap);
}

function onChannel4Message(flap: Flap) {
    console.log('Channel 4 Flap: ', flap);
}

function onChannel5Message(flap: Flap) {
    console.log('Channel 5 Flap: ', flap);
}
