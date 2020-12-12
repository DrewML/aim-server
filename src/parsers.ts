import assert from 'assert';
import { Flap, Snac } from './types';

/**
 * @see https://en.wikipedia.org/wiki/OSCAR_protocol#FLAP_header
 */
export function parseFlap(rawFlap: Buffer): Flap {
    const id = rawFlap.readUInt8(0);
    assert(id === 0x2a, 'Unexpected Flap ID');

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
    const screennameType = buf.readUInt16BE(0);
    // TODO: Need to check if collections of TLVs in a SNAC are always
    // ordered or not. If they're ordered, the TLV type validation here
    // won't matter
    assert(screennameType === 0x1, 'Unexpected TLV in parseAuthRequest');

    const screennameLength = buf.readUInt16BE(2);
    const screenname = buf.toString('ascii', 4, 4 + screennameLength);

    return { screenname };
}
