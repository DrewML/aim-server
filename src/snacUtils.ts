import { Snac } from './types';
import { SNACS } from './constants';

/**
 * @summary Determines whether a Snac is a specific
 *          family and subtype
 */
export function matchSnac<
    TFamily extends keyof typeof SNACS,
    TSubtype extends keyof typeof SNACS[TFamily]['subtypes']
>(snac: Snac, family: TFamily, subtype: TSubtype) {
    const snacDef = SNACS[family];

    return (
        snac.family === snacDef.family &&
        // @ts-ignore TODO: Look into this (lol)
        snac.subtype === snacDef.subtypes[subtype]
    );
}

interface BuildSnacOpts {
    family: number;
    subtype: number;
    flags?: number;
    reqID: number;
    data: Buffer;
}

export function buildSnac({
    family,
    subtype,
    flags = 0,
    reqID,
    data,
}: BuildSnacOpts) {
    const buf = Buffer.alloc(10);
    buf.writeUInt16BE(family, 0);
    buf.writeUInt16BE(subtype, 2);
    buf.writeUInt16BE(flags, 4);
    buf.writeUInt32BE(reqID, 6);

    return Buffer.concat([buf, data]);
}

/**
 * @see http://web.archive.org/web/20080308233204/http://dev.aol.com/aim/oscar/#SNAC
 */
export function parseSnac(rawSnac: Buffer): Snac {
    return {
        family: rawSnac.readUInt16BE(0),
        subtype: rawSnac.readUInt16BE(2),
        flags: rawSnac.readUInt16BE(4),
        requestID: rawSnac.readUInt32BE(6),
        data: rawSnac.subarray(10),
    };
}
