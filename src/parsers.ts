import assert from 'assert';
import { Flap } from './types';

/**
 * @see https://en.wikipedia.org/wiki/OSCAR_protocol#FLAP_header
 */
export function parseFlap(msg: Buffer): Flap {
    const id = msg.readUInt8(0);
    assert(id === 0x2a, 'Unexpected Flap ID');

    return {
        channel: msg.readUInt8(1),
        sequence: msg.readUInt16BE(2),
        byteLength: msg.readUInt16BE(4),
        data: msg.subarray(6),
    };
}
