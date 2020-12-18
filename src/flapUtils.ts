import { assert } from 'console';
import { Flap } from './types';

interface BuildFlapOpts {
    channel: number;
    sequence: number;
    data: Buffer;
}

export function buildFlap({ channel, sequence, data }: BuildFlapOpts) {
    assert(channel < 6 && channel > 0, `Unexpected Channel: ${channel}`);

    const buf = Buffer.alloc(6);
    buf.writeUInt8(0x2a, 0); // Flap start signal
    buf.writeUInt8(channel, 1);
    buf.writeUInt16BE(sequence, 2);
    buf.writeUInt16BE(data.byteLength, 4);

    return Buffer.concat([buf, data]);
}

/**
 * @see https://en.wikipedia.org/wiki/OSCAR_protocol#FLAP_header
 */
export function parseFlap(rawFlap: Buffer): Flap {
    const id = rawFlap.readUInt8(0);
    assert(id === 0x2a, 'Unexpected Flap ID');

    const flap: Flap = {
        channel: rawFlap.readUInt8(1),
        sequence: rawFlap.readUInt16BE(2),
        byteLength: rawFlap.readUInt16BE(4),
        data: rawFlap.subarray(6),
    };

    return flap;
}
