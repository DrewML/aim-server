export function stringTLV(type: number, value: string) {
    const typeAndLength = Buffer.alloc(4);
    typeAndLength.writeUInt16BE(type);
    typeAndLength.writeUInt16BE(value.length, 2);

    return Buffer.concat([typeAndLength, Buffer.from(value, 'ascii')]);
}

export function uint16TLV(type: number, value: number) {
    const buf = Buffer.alloc(6);
    buf.writeUInt16BE(type);
    buf.writeUInt16BE(2, 2);
    buf.writeUInt16BE(value, 4);

    return buf;
}
