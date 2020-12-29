import assert from 'assert';
import { TLVBuilder } from '../buildTLV';
import { buildSnac } from '../snacUtils';
import { SNACS } from '../constants';
import { uint16 } from '../buf';
import { LoginError } from '../types';

/**
 * @see http://iserverd1.khstu.ru/oscar/snac_17_07.html
 * @param authKey Key for client to use when encrypting password. Size should not exceed u32 int
 * @param reqID   SNAC Request ID from client auth request
 */
export function authKeyResponseSnac(authKey: string, reqID: number) {
    assert(authKey.length < 0xffff, 'authKey size exceeds u32 int');

    const authKeyBuf = Buffer.from(authKey, 'utf8');
    // Note: The linked docs for this SNAC are wrong.
    // The length should be a word (2 byte), not a dword (4 bytes)
    const authKeyLen = uint16([authKeyBuf.byteLength]);

    return buildSnac({
        family: SNACS.AUTH.family,
        subtype: SNACS.AUTH.subtypes.MD5_AUTH_RESPONSE,
        reqID,
        data: Buffer.concat([authKeyLen, authKeyBuf]),
    });
}

/**
 * @see http://iserverd1.khstu.ru/oscar/snac_17_03.html
 */
export function loginErrorSnac(opts: {
    screenname: string;
    // http://iserverd1.khstu.ru/oscar/auth_failed.html
    errorCode: LoginError;
    errorURL: string;
    reqID: number;
}) {
    const tlv = new TLVBuilder()
        .string(0x1, opts.screenname)
        .uint16(0x8, opts.errorCode)
        .string(0x4, opts.errorURL);

    return buildSnac({
        family: SNACS.AUTH.family,
        subtype: SNACS.AUTH.subtypes.LOGIN_REPLY,
        reqID: opts.reqID,
        data: tlv.asRest(),
    });
}

/**
 * @see http://iserverd1.khstu.ru/oscar/snac_17_03.html
 */
export function loginSuccessSnac(opts: {
    screenname: string;
    email: string;
    bosAddress: string;
    authCookie: string;
    latestBetaVersion: string;
    latestBetaChecksum: string;
    passwordChangeURL: string;
    reqID: number;
}) {
    const tlv = new TLVBuilder()
        .string(0x1, opts.screenname)
        .string(0x11, opts.email)
        .string(0x5, opts.bosAddress)
        .string(0x6, opts.authCookie)
        .string(0x40, opts.latestBetaVersion)
        .string(0x48, opts.latestBetaChecksum)
        .string(0x54, opts.passwordChangeURL);

    return buildSnac({
        family: SNACS.AUTH.family,
        subtype: SNACS.AUTH.subtypes.LOGIN_REPLY,
        reqID: opts.reqID,
        data: tlv.asRest(),
    });
}
