import { parseTLVs } from './parseTLVs';
import { TLVS } from './constants';

/**
 * @see http://iserverd1.khstu.ru/oscar/snac_17_06.html
 */
export function parseAuthRequest(data: Buffer) {
    const tlvs = parseTLVs(data);
    const screennameTLV = tlvs.first(TLVS.SCREENNAME);

    return {
        screenname: screennameTLV.value.toString('ascii'),
    };
}

/**
 * @see http://iserverd1.khstu.ru/oscar/snac_17_02.html
 */
export function parseMD5LoginRequest(data: Buffer) {
    const tlvs = parseTLVs(data);
    const screenname = tlvs.first(TLVS.SCREENNAME).value.toString('ascii');
    const newHashStrategy = tlvs.has(TLVS.USE_NEW_HASH_STRATEGY);
    const passwordHash = tlvs.first(TLVS.PASSWORD_HASH).value;
    const clientID = tlvs.first(TLVS.CLIENT_ID_STRING).value.toString('ascii');

    return { screenname, passwordHash, clientID, newHashStrategy };
}
