/**
 * @see http://web.archive.org/web/20080308233204/http://dev.aol.com/aim/oscar/#FLAP__FRAME_TYPE
 */
export const enum FlapType {
    SIGNON = 1,
    DATA = 2,
    ERROR = 3,
    SIGNOFF = 4,
    KEEPALIVE = 5,
}

export const enum LoginError {
    INCORRECT_NICK_OR_PASS = 0x4,
}

/**
 * @see http://iserverd1.khstu.ru/oscar/tlv_tags.html
 */
export const enum TLV {
    SCREENNAME = 0x1,
    NEW_PASSWORD = 0x2,
    CLIENT_ID_STRING = 0x3,
    ERROR_DESCRIP_URL = 0x4,
    BOS_ADDRESS = 0x5,
    AUTH_COOKIE = 0x6,
    SNAC_VERSION = 0x7,
    ERROR_SUBCODE = 0x8,
    DISCONNECT_REASON = 0x9,
    RECONNECT_HOST = 0xa,
    URL = 0xb,
    DEBUG_DATA = 0xc,
    FAMILY_ID = 0xd,
    CLIENT_COUNTRY = 0xe,
    CLIENT_LANG = 0xf,
    SCRIPT = 0x10,
    EMAIL = 0x11,
    OLD_PASSWORD = 0x12,
    REGISTRATION_STATUS = 0x13,
    DISTRIBUTION_NUM = 0x14,
    PERSONAL_TEXT = 0x15,
    CLIENT_ID = 0x16,
    CLIENT_MAJOR = 0x17,
    CLIENT_MINOR = 0x18,
    CLIENT_LESSER = 0x19,
    CLIENT_BUILD = 0x1a,
    PASSWORD_HASH = 0x25,
    LATEST_BETA_VERSION = 0x40,
    BETA_DIGEST_SIG = 0x48,
    RELEASE_DIGEST_SIG = 0x49,
    CHANGE_PASSWORD_URL = 0x54,
    USE_NEW_HASH_STRATEGY = 0x4c,
}

export const enum UserClass {
    UNCONFIRMED = 0x1,
    ADMIN = 0x2,
    AOL_STAFF = 0x4,
    AOL_COMMERCIAL = 0x8,
    ICQ_FREE = 0x10,
    AWAY = 0x20,
    ICQ = 0x40,
    WIRELESS = 0x80,
}

export const enum UserStatusFlag {
    WEBAWARE = 0x1,
    SHOWIP = 0x2,
    BIRTHDAY = 0x8,
    WEBFRONT = 0x20,
    DC_DISABLED = 0x100,
    DC_WITH_AUTH = 0x1000,
    DC_WITH_CONTACTS = 0x2000,
}

export const enum UserStatus {
    ONLINE = 0x0,
    AWAY = 0x1,
    DND = 0x2,
    NA = 0x4,
    BUSY = 0x10,
    FREE_TO_CHAT = 0x20,
    INVISIBLE = 0x100,
}

/**
 * @see http://web.archive.org/web/20080308233204/http://dev.aol.com/aim/oscar/#FLAP
 */
export interface Flap {
    type: FlapType;
    sequence: number;
    byteLength: number;
    data: Buffer;
}

/**
 * @see http://web.archive.org/web/20080308233204/http://dev.aol.com/aim/oscar/#SNAC
 */
export interface Snac {
    family: number;
    subtype: number;
    flags: number;
    requestID: number;
    data: Buffer;
}
