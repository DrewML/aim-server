/**
 * @see http://web.archive.org/web/20080308233204/http://dev.aol.com/aim/oscar/#FLAP__SIGNON_FRAME
 */
export function signonFlap() {
    const buf = Buffer.alloc(7);
    buf.writeUInt8(0x2a, 0); // start byte
    buf.writeUInt8(0x1, 1); // flap channel
    buf.writeUInt16BE(0x1, 2); // sequence number
    buf.writeUInt16BE(0x1, 4); // data size (flap version)
    buf.writeUInt8(0x1, 6); // flap version

    return buf;
}
