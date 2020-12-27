/**
 * @see http://web.archive.org/web/20080308233204/http://dev.aol.com/aim/oscar/#FLAP__FRAME_TYPE
 */
export const enum FlapType {
    SIGNON = 1,
    DATA = 2,
    ERROR = 3,
    SIGNOFF = 4,
    KEEPALIVE = 5,
}

/**
 * @see http://web.archive.org/web/20080308233204/http://dev.aol.com/aim/oscar/#FLAP
 */
export interface Flap {
    type: FlapType;
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

/**
 * @see http://iserverd1.khstu.ru/oscar/basic.html#b0003
 */
export interface TLV {
    type: number;
    length: number;
    value: Buffer;
}
