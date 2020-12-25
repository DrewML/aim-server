import assert from 'assert';
import { parseTLVs } from '../parseTLVs';
import { TLVS } from '../constants';

/**
 * @see http://iserverd.khstu.ru/oscar/cli_cookie.html
 */
export function parseCookieRequest(data: Buffer) {
    const flapVersion = data.readUInt32BE(0);
    assert(flapVersion === 0x1, 'Incorrect client FLAP version');

    const tlvs = parseTLVs(data.subarray(4));
    const authCookie = tlvs.first(TLVS.AUTH_COOKIE).value;

    return { authCookie };
}
