import assert from 'assert';
import { parseTLVs } from '../parseTLVs';
import { TLV } from '../types';

/**
 * @see http://iserverd.khstu.ru/oscar/cli_cookie.html
 */
export function parseCookieRequest(data: Buffer) {
    const flapVersion = data.readUInt32BE(0);
    assert(flapVersion === 0x1, 'Incorrect client FLAP version');

    const tlvs = parseTLVs(data.subarray(4));
    const authCookie = tlvs.first(TLV.AUTH_COOKIE).value;

    return { authCookie };
}
