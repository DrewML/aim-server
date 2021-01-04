import assert from 'assert';
import { Flap, FlapType } from './types';

interface BuildFlapOpts {
    type: FlapType;
    sequence: number;
    data: Buffer;
}

export function buildFlap({ type, sequence, data }: BuildFlapOpts) {
    assert(type < 6 && type > 0, `Unexpected Flap Frame Type: ${type}`);

    const buf = Buffer.alloc(6);
    buf.writeUInt8(0x2a, 0); // Flap start byte
    buf.writeUInt8(type, 1);
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

    const type = rawFlap.readUInt8(1);
    const sequence = rawFlap.readUInt16BE(2);
    const byteLength = rawFlap.readUInt16BE(4);
    const remainingData = rawFlap.subarray(6);

    assert(remainingData.byteLength === byteLength, 'Malformed FLAP');

    return { type, sequence, byteLength, data: remainingData };
}
