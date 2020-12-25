import { buildSnac } from '../snacUtils';
import { SNACS } from '../constants';
import { uint16BEBuffer } from '../buf';

/**
 * @see http://iserverd.khstu.ru/oscar/snac_01_03.html
 */
export function supportedFamiliesSnac(opts: { reqID: number }) {
    /**
     * @see http://iserverd.khstu.ru/oscar/families.html
     */
    const families = uint16BEBuffer([
        SNACS.GENERAL.family,
        SNACS.LOCATION.family,
        SNACS.BUDDYLIST.family,
        SNACS.ICBM.family,
        SNACS.INVITATION.family,
        SNACS.ADMINISTRATIVE.family,
        SNACS.POPUP_NOTICE.family,
        SNACS.PRIVACY_MGMT.family,
        SNACS.USER_LOOKUP.family,
        SNACS.USAGE_STATS.family,
        SNACS.SSI.family,
        SNACS.OFFLINE.family,
    ]);

    return buildSnac({
        family: SNACS.GENERAL.family,
        subtype: SNACS.GENERAL.subtypes.SUPPORTED_FAMILIES,
        reqID: opts.reqID,
        data: families,
    });
}

/**
 * @see http://iserverd.khstu.ru/oscar/snac_01_18.html
 */
export function familyVersionsSnac(opts: { reqID: number }) {
    // prettier-ignore
    const versions = uint16BEBuffer([
        // family, version
        SNACS.GENERAL.family, 0x3,
        SNACS.LOCATION.family, 0x1,
        SNACS.BUDDYLIST.family, 0x1,
        SNACS.ICBM.family, 0x1,
        SNACS.INVITATION.family, 0x1,
        SNACS.ADMINISTRATIVE.family, 0x1,
        SNACS.POPUP_NOTICE.family, 0x1,
        SNACS.PRIVACY_MGMT.family, 0x1,
        SNACS.USER_LOOKUP.family, 0x1,
        SNACS.USAGE_STATS.family, 0x1,
        SNACS.SSI.family, 0x1,
        SNACS.OFFLINE.family, 0x1,
    ]);

    return buildSnac({
        family: SNACS.GENERAL.family,
        subtype: SNACS.GENERAL.subtypes.SERVER_FAMILY_VERSIONS,
        reqID: opts.reqID,
        data: versions,
    });
}

export function rateLimitInfoSnac(opts: { reqID: number }) {
    // TODO: Implement
    return Buffer.alloc(0);
}
