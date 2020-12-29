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

export const enum LoginError {
    INCORRECT_NICK_OR_PASS = 0x4,
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
