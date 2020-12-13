import assert from 'assert';
import { Flap, Snac } from './types';

/**
 * @see https://en.wikipedia.org/wiki/OSCAR_protocol#FLAP_header
 */
export function parseFlap(rawFlap: Buffer): Flap {
    const id = rawFlap.readUInt8(0);
    assert(id === 0x2a, 'Unexpected Flap ID');

    // TODO: Implement custom util.inspect.custom logger
    // for better debugging
    return {
        channel: rawFlap.readUInt8(1),
        sequence: rawFlap.readUInt16BE(2),
        byteLength: rawFlap.readUInt16BE(4),
        data: rawFlap.subarray(6),
    };
}

/**
 * @see http://web.archive.org/web/20080308233204/http://dev.aol.com/aim/oscar/#SNAC
 */
export function parseSnac(rawSnac: Buffer): Snac {
    // TODO: Implement custom util.inspect.custom logger
    // for better debugging
    return {
        family: rawSnac.readUInt16BE(0),
        subtype: rawSnac.readUInt16BE(2),
        flags: rawSnac.readUInt16BE(4),
        requestID: rawSnac.readUInt32BE(6),
        data: rawSnac.subarray(10),
    };
}

/**
 * @see http://iserverd1.khstu.ru/oscar/snac_17_06.html
 */
export function parseAuthRequest(buf: Buffer) {
    const tlvs = parseTLVs(buf);
    const screennameTLV = tlvs.find((t) => t.type === 0x1);
    assert(
        screennameTLV && screennameTLV.value,
        'Screen-name TLV missing in parseAuthRequest',
    );

    return {
        screenname: screennameTLV.value.toString('ascii'),
    };
}

export function parseMD5LoginRequest(buf: Buffer) {
    // TODO: Parse TLVs and return structured data
}

/**
 * @see http://iserverd1.khstu.ru/oscar/basic.html#b0003
 * @todo This should return a dict/map keyed by type, because
 *       the O(n) lookups everywhere suck. Downside is that > 1
 *       of the same TLV type can be in a SNAC, so we need a
 *       a dict/map impl that will handle that
 */
export function parseTLVs(buf: Buffer) {
    const tlvs = [];

    for (let tlvStart = 0; tlvStart < buf.byteLength; ) {
        const type = buf.readUInt16BE(tlvStart);

        const lengthStart = tlvStart + 2;
        const length = buf.readUInt16BE(lengthStart);

        const valueStart = lengthStart + 2;
        // A TLV's value can be 0 bytes. Odd that they're
        // not just excluded from the request, but ¯\_(ツ)_/¯
        const value = length
            ? buf.subarray(valueStart, valueStart + length)
            : null;

        tlvs.push({ type, length, value });

        tlvStart = valueStart + length;
    }

    return tlvs;
}
