import { parseTLVs } from '../parseTLVs';

/**
 * @see http://iserverd1.khstu.ru/oscar/snac_17_06.html
 */
export function parseAuthRequest(data: Buffer) {
    const tlvs = parseTLVs(data);
    const screennameTLV = tlvs.first(0x1);

    return {
        screenname: screennameTLV.value.toString('ascii'),
    };
}

/**
 * @see http://iserverd1.khstu.ru/oscar/snac_17_02.html
 */
export function parseMD5LoginRequest(data: Buffer) {
    const tlvs = parseTLVs(data);
    const screenname = tlvs.first(0x1).value.toString('ascii');
    const newHashStrategy = tlvs.has(0x4c);
    const passwordHash = tlvs.first(0x25).value;
    const clientID = tlvs.first(0x3).value.toString('ascii');

    return { screenname, passwordHash, clientID, newHashStrategy };
}
