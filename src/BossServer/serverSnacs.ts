import { buildSnac } from '../snacUtils';
import { SNACS } from '../constants';
import { endianness } from 'os';

/**
 * @see http://iserverd.khstu.ru/oscar/snac_01_03.html
 */
export function supportedFamiliesSnac(opts: { reqID: number }) {
    /**
     * @see http://iserverd.khstu.ru/oscar/families.html
     */
    const families = Buffer.from(
        Uint16Array.from([
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
        ]).buffer,
    );
    // There has to be less noisy sugar for generating a BE
    // list of 16 bit ints...
    if (endianness() === 'LE') families.swap16();

    return buildSnac({
        family: SNACS.GENERAL.family,
        subtype: SNACS.GENERAL.subtypes.SUPPORTED_FAMILIES,
        reqID: opts.reqID,
        data: Buffer.from(Uint16Array.from(families).buffer).swap16(),
    });
}
