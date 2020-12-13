/**
 * @see http://web.archive.org/web/20080308233204/http://dev.aol.com/aim/oscar/#FLAP
 */
export interface Flap {
    channel: number;
    sequence: number;
    byteLength: number;
    data: Buffer;
}

/**
 * @see http://web.archive.org/web/20080308233204/http://dev.aol.com/aim/oscar/#SNAC
 */
export interface Snac {
    family: number;
    subtype: number;
    flags: number;
    requestID: number;
    data: Buffer;
}

export interface TLV {
    type: number;
    length: number;
    value: Buffer;
}
