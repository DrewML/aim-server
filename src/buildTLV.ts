import { TLV } from './types';
import { uint16 } from './buf';

/**
 * @summary Build a set of TLV (Type/Length/Value),
 *          and compile them to various formats described
 *          in the Oscar Protocol.
 * @see     http://web.archive.org/web/20080308233204/http://dev.aol.com/aim/oscar/#TLV
 */
export class TLVBuilder {
    private tlvs: Buffer[] = [];
    /**
     * @summary Build a TLV Block. This encodes a set
     *          of TLVs as a uint16 of the total # of TLVs,
     *          followed by the TLV data
     */
    asBlock() {
        return Buffer.from([uint16(this.tlvs.length), this.concatAll()]);
    }

    /**
     * @summary Build a TLV L Block aka "length block".
     *          This encodes a set of TLVs as a uint16
     *          of the combined byte size, followed
     *          by the TLV data
     */
    asLBlock() {
        const all = this.concatAll();
        return Buffer.from([uint16(all.byteLength), all]);
    }

    /**
     * @summary Build a TLV Rest block. These are only
     *          used within SNACs. They don't specify
     *          their combined size. Instead, the TLVs
     *          are assumed to be the remaining size
     *          of a SNAC's bytes
     */
    asRest() {
        return this.concatAll();
    }

    private concatAll() {
        return Buffer.concat(this.tlvs);
    }

    uint8(tag: TLV, value: number) {
        const buf = Buffer.alloc(5);
        buf.writeUInt16BE(tag);
        buf.writeUInt16BE(1, 2);
        buf.writeUInt8(value, 4);
        this.tlvs.push(buf);
        return this;
    }

    uint16(tag: TLV, value: number) {
        const buf = Buffer.alloc(6);
        buf.writeUInt16BE(tag);
        buf.writeUInt16BE(2, 2);
        buf.writeUInt16BE(value, 4);
        this.tlvs.push(buf);
        return this;
    }

    uint32(tag: TLV, value: number) {
        const buf = Buffer.alloc(8);
        buf.writeUInt16BE(tag);
        buf.writeUInt16BE(4, 2);
        buf.writeUInt32BE(value, 4);
        this.tlvs.push(buf);
        return this;
    }

    string(tag: TLV, value: string) {
        const typeAndLength = Buffer.alloc(4);
        typeAndLength.writeUInt16BE(tag);
        typeAndLength.writeUInt16BE(value.length, 2);

        const buf = Buffer.concat([typeAndLength, Buffer.from(value, 'ascii')]);
        this.tlvs.push(buf);
        return this;
    }
}
