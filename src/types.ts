/**
 * @see http://web.archive.org/web/20080308233204/http://dev.aol.com/aim/oscar/#FLAP
 */
export interface Flap {
    channel: number;
    sequence: number;
    byteLength: number;
    data: Buffer;
}
