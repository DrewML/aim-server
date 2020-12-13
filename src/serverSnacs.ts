import assert from 'assert';
import { Snac } from './types';
import { SNACS } from './constants';

/**
 * @summary Determines whether a Snac is a specific
 *          family and subtype
 */
export function matchSnac<
    TFamily extends keyof typeof SNACS,
    TSubtype extends keyof typeof SNACS[TFamily]['subtypes']
>(snac: Snac, family: TFamily, subtype: TSubtype) {
    const snacDef = SNACS[family];

    return (
        snac.family === snacDef.family &&
        // @ts-ignore TODO: Look into this (lol)
        snac.subtype === snacDef.subtypes[subtype]
    );
}

interface BuildSnacOpts {
    family: number;
    subtype: number;
    flags?: number;
    reqID: number;
    data: Buffer;
}

export function buildSnac({
    family,
    subtype,
    flags = 0,
    reqID,
    data,
}: BuildSnacOpts) {
    const buf = Buffer.alloc(10);
    buf.writeUInt16BE(family, 0);
    buf.writeUInt16BE(subtype, 2);
    buf.writeUInt16BE(flags, 4);
    buf.writeUInt32BE(reqID, 6);

    return Buffer.concat([buf, data]);
}

/**
 * @see http://iserverd1.khstu.ru/oscar/snac_17_07.html
 * @param authKey Key for client to use when encrypting password. Size should not exceed u32 int
 * @param reqID   SNAC Request ID from client auth request
 */
export function authKeyResponseSnac(authKey: string, reqID: number) {
    assert(authKey.length < 0xffff, 'authKey size exceeds u32 int');

    const authKeyBuf = Buffer.from(authKey, 'ascii');
    const authKeyLen = Buffer.alloc(32);
    authKeyLen.writeUInt32BE(authKeyBuf.byteLength, 0);

    return buildSnac({
        family: 0x17,
        subtype: 0x7,
        reqID,
        data: Buffer.concat([authKeyLen, authKeyBuf]),
    });
}
