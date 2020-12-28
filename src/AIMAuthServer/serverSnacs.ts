import assert from 'assert';
import { TLVBuilder } from '../buildTLV';
import { buildSnac } from '../snacUtils';
import { SNACS } from '../constants';
import { uint16 } from '../buf';
import { TLV } from '../types';

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
    errorCode: number;
    errorURL: string;
    reqID: number;
}) {
    const tlv = new TLVBuilder()
        .string(TLV.SCREENNAME, opts.screenname)
        .uint16(TLV.ERROR_SUBCODE, opts.errorCode)
        .string(TLV.ERROR_DESCRIP_URL, opts.errorURL);

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
        .string(TLV.SCREENNAME, opts.screenname)
        .string(TLV.EMAIL, opts.email)
        .string(TLV.BOS_ADDRESS, opts.bosAddress)
        .string(TLV.AUTH_COOKIE, opts.authCookie)
        .string(TLV.LATEST_BETA_VERSION, opts.latestBetaVersion)
        .string(TLV.BETA_DIGEST_SIG, opts.latestBetaChecksum)
        .string(TLV.CHANGE_PASSWORD_URL, opts.passwordChangeURL);

    return buildSnac({
        family: SNACS.AUTH.family,
        subtype: SNACS.AUTH.subtypes.LOGIN_REPLY,
        reqID: opts.reqID,
        data: tlv.asRest(),
    });
}
