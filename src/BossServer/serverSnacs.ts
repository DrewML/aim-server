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
    // Note: The official Oscar protocol docs claim something
    // completely different for this snac. But the unofficial
    // docs seem to be correct (weird)
    // http://web.archive.org/web/20080308233204/http://dev.aol.com/aim/oscar/#OSERVICE__MIGRATE_GROUPS

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

/**
 * @description Create a SNAC specifying the server-enforced
 *              rate limits. Note that this server currently
 *              doesn't enforce rate limits, this is just a
 *              necessary part of the signon process
 * @see http://iserverd.khstu.ru/oscar/snac_01_07.html
 * @see http://web.archive.org/web/20060113101258/http://joust.kano.net/wiki/oscar/moin.cgi/RateLimiting
 * @see http://web.archive.org/web/20080308233204/http://dev.aol.com/aim/oscar/#RATELIMIT
 */
export function rateLimitInfoSnac(opts: { reqID: number }) {
    // prettier-ignore
    const data = Buffer.from([
        0x0, 0x0, // uint16, number of rate classes
        // Here is where all the rate classes would normally go.
        // Luckily we can save a bunch of time because AIM clients
        // (at least 5.2) will accept 0 total rate classes, as far
        // as I can tell. Will likely implement proper rate classes
        // when the server itself has rate limiting functionality
    ]);

    return buildSnac({
        family: SNACS.GENERAL.family,
        subtype: SNACS.GENERAL.subtypes.RATE_INFO_RESPONSE,
        reqID: opts.reqID,
        data,
    });
}
