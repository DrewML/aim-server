import { parseTLVs } from '../parseTLVs';
import { TLV } from '../types';

/**
 * @see http://iserverd1.khstu.ru/oscar/snac_17_06.html
 */
export function parseAuthRequest(data: Buffer) {
    const tlvs = parseTLVs(data);
    const screennameTLV = tlvs.first(TLV.SCREENNAME);

    return {
        screenname: screennameTLV.value.toString('ascii'),
    };
}

/**
 * @see http://iserverd1.khstu.ru/oscar/snac_17_02.html
 */
export function parseMD5LoginRequest(data: Buffer) {
    const tlvs = parseTLVs(data);
    const screenname = tlvs.first(TLV.SCREENNAME).value.toString('ascii');
    const newHashStrategy = tlvs.has(TLV.USE_NEW_HASH_STRATEGY);
    const passwordHash = tlvs.first(TLV.PASSWORD_HASH).value;
    const clientID = tlvs.first(TLV.CLIENT_ID_STRING).value.toString('ascii');

    return { screenname, passwordHash, clientID, newHashStrategy };
}
