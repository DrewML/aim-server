import assert from 'assert';

/**
 * @see http://iserverd1.khstu.ru/oscar/snac_17_07.html
 * @param authKey Key for client to use when encrypting password. Size should not exceed u32 int
 * @param reqID   SNAC Request ID from client auth request
 */
export function authKeyResponseSnac(authKey: string, reqID: number) {
    assert(authKey.length < 0xffff, 'authKey size exceeds u32 int');

    const id = Buffer.alloc(32);
    id.writeUInt32BE(reqID);

    const snacHeader = Buffer.from([
        0x0,
        0x17, // family
        0x0,
        0x7, // subtype
        0x0,
        0x0, // flags,
        id,
    ]);

    const authKeyBuf = Buffer.from(authKey, 'ascii');
    const authKeyLen = Buffer.alloc(32);
    authKeyLen.writeUInt32BE(authKeyBuf.byteLength, 0);

    return Buffer.concat([snacHeader, authKeyLen, authKeyBuf]);
}
