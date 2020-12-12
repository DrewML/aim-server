import net from 'net';
import assert from 'assert';
import { Flap } from './types';
import { signonFlap } from './serverFlaps';
import { parseFlap } from './parsers';

const server = net.createServer((c) => {
    console.log('New socket opened');

    c.on('end', () => {
        console.log('client disconnected');
    });

    c.on('connect', () => console.log('Socket connected'));
    c.on('error', (e) => console.log('Socket error', e));
    c.on('close', () => {
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

    c.on('data', (buf) => {
        const flap = parseFlap(buf);
        const handler = handlers[flap.channel];

        if (!handler) {
            console.warn(`Unrecognized FLAP channel "${flap.channel}"`, flap);
            return;
        }

        handler(flap);
    });

    // Send OSCAR connection handshake
    c.write(signonFlap());
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
    [key: number]: (flap: Flap) => void;
}

function onChannel1Message(flap: Flap) {
    const flapVersion = flap.data.readUInt32BE(0);
    assert(flapVersion === 0x1, 'Incorrect client FLAP version');
}

function onChannel2Message(flap: Flap) {
    console.log('Channel 2 Flap: ', flap);
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
