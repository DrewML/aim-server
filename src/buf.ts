import { endianness } from 'os';

const isLE = endianness() === 'LE';

/**
 * @summary Create a UInt16BE buffer from an array of integers
 */
export function uint16(values: number | number[]) {
    const nums = Array.isArray(values) ? values : [values];
    const buf = Buffer.from(Uint16Array.from(nums).buffer);
    if (isLE) buf.swap16();
    return buf;
}
