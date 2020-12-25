import { endianness } from 'os';

const isLE = endianness() === 'LE';

/**
 * @summary Create a UInt16BE buffer from an array of integers
 */
export function uint16BEBuffer(array: number[]) {
    const buf = Buffer.from(Uint16Array.from(array).buffer);
    if (isLE) buf.swap16();
    return buf;
}
