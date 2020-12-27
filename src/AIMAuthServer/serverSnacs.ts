import assert from 'assert';
import { stringTLV, uint16TLV } from '../buildTLV';
import { buildSnac } from '../snacUtils';
import { SNACS, TLVS } from '../constants';
import { uint16BEBuffer } from '../buf';

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
    const authKeyLen = uint16BEBuffer([authKeyBuf.byteLength]);

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
    const screenname = stringTLV(TLVS.SCREENNAME, opts.screenname);
    const errorCode = uint16TLV(TLVS.ERROR_SUBCODE, opts.errorCode);
    const errorURL = stringTLV(TLVS.ERROR_DESCRIP_URL, opts.errorURL);

    return buildSnac({
        family: SNACS.AUTH.family,
        subtype: SNACS.AUTH.subtypes.LOGIN_REPLY,
        reqID: opts.reqID,
        data: Buffer.concat([screenname, errorCode, errorURL]),
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
    const screenname = stringTLV(TLVS.SCREENNAME, opts.screenname);
    const email = stringTLV(TLVS.EMAIL, opts.email);
    const bosAddress = stringTLV(TLVS.BOS_ADDRESS, opts.bosAddress);
    const authCookie = stringTLV(TLVS.AUTH_COOKIE, opts.authCookie);
    const betaVersion = stringTLV(
        TLVS.LATEST_BETA_VERSION,
        opts.latestBetaVersion,
    );
    const betaChecksum = stringTLV(
        TLVS.BETA_DIGEST_SIG,
        opts.latestBetaChecksum,
    );
    const changePasswordURL = stringTLV(
        TLVS.CHANGE_PASSWORD_URL,
        opts.passwordChangeURL,
    );

    return buildSnac({
        family: SNACS.AUTH.family,
        subtype: SNACS.AUTH.subtypes.LOGIN_REPLY,
        reqID: opts.reqID,
        data: Buffer.concat([
            screenname,
            email,
            bosAddress,
            authCookie,
            betaVersion,
            betaChecksum,
            changePasswordURL,
        ]),
    });
}
