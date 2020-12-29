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
