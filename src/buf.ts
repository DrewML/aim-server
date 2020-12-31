import { endianness } from 'os';

const GREEN_TEXT = '\x1b[32m';
const RESET_TEXT = '\x1b[0m';

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

/**
 * @summary Pretty print a Buffer as hex-encoded bytes
 */
export function prettyPrint(buffer: Buffer, maxBytesPerLine = 10) {
    const hexStr = buffer.toString('hex');
    // split hex string into byte-sized chunks
    const bytes = hexStr.match(/.{1,2}/g);

    if (!bytes) return '';

    let output = '';
    let itemCount = 0;

    while (bytes.length) {
        const byte = bytes.shift();
        output += `0x${byte}`;

        if (itemCount + 1 === maxBytesPerLine) {
            // reset line item counter
            itemCount = 0;
            // drop to a new line
            output += '\n';
        } else {
            if (bytes.length) {
                // not the last item in the row, so add whitespace padding
                output += ' ';
            }
            itemCount++;
        }
    }

    return `${GREEN_TEXT}${output}${RESET_TEXT}`;
}
