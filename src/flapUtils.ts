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
 * @todo Probably be nice to make this lazy via a generator function
 */
export function parseFlaps(buf: Buffer): Flap[] {
    const flaps: Flap[] = [];
    let offset = 0;

    while (offset < buf.byteLength - 1) {
        const startByte = buf.readUInt8(offset);
        offset++;
        assert(startByte === 0x2a, 'Unexpected FLAP start byte');

        const type = buf.readUInt8(offset);
        offset++;
        const sequence = buf.readUInt16BE(offset);
        offset += 2;
        const byteLength = buf.readUInt16BE(offset);
        offset += 2;
        const data = buf.subarray(offset, offset + byteLength);
        offset += byteLength;

        flaps.push({ type, sequence, byteLength, data });
    }

    return flaps;
}
