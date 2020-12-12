import net from 'net';
import assert from 'assert';

interface Flap {
    channel: number;
    sequence: number;
    byteLength: number;
    data: Buffer;
}

/**
 * @see https://en.wikipedia.org/wiki/OSCAR_protocol#FLAP_header
 */
function parseFlap(msg: Buffer): Flap {
    const id = msg.readUInt8(0);
    assert(id === 0x2a, 'Unexpected Flap ID');

    return {
        channel: msg.readUInt8(1),
        sequence: msg.readUInt16BE(2),
        byteLength: msg.readUInt16BE(4),
        data: Buffer.from(msg, 6),
    };
}

/**
 * @see http://web.archive.org/web/20080308233204/http://dev.aol.com/aim/oscar/#FLAP__SIGNON_FRAME
 */
function signonFlap() {
    const buf = Buffer.alloc(7);
    buf.writeUInt8(0x2a, 0); // start byte
    buf.writeUInt8(0x1, 1); // flap channel
    buf.writeUInt16BE(0x1, 2); // sequence number
    buf.writeUInt16BE(0x1, 4); // data size (flap version)
    buf.writeUInt8(0x1, 6); // flap version

    return buf;
}

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

    function onChannel2Message(flap: Flap) {
        console.log('Channel 2 Flap: ', flap);
    }

    c.on('data', (buf) => {
        const flap = parseFlap(buf);
        // http://web.archive.org/web/20080308233204/http://dev.aol.com/aim/oscar/#FLAP__FRAME_TYPE
        switch (flap.channel) {
            case 1:
                // SIGNON frame response
                // TODO: assert flap version is always 1
                break;
            case 2:
                onChannel2Message(flap);
                break;
            case 3:
                // FLAP-level error
                // TODO: Error logging
                break;
            case 4:
                // Signoff negotiation
                // TODO: Implement when sessions are implemented
                break;
            case 5:
                // Keep-alive heartbeat
                // TODO: Implement when sessions are implemented
                break;
            default:
                throw new Error(`Unrecognized FLAP channel "${flap.channel}"`);
        }
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
