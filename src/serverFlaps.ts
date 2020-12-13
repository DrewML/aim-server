import { assert } from 'console';

interface BuildFlapOpts {
    channel: number;
    sequence: number;
    data: Buffer;
}

export function buildFlap({ channel, sequence, data }: BuildFlapOpts) {
    assert(channel < 6 && channel > 0, `Unexpected Channel: ${channel}`);

    const buf = Buffer.alloc(6);
    buf.writeUInt8(0x2a, 0); // Flap start signal
    buf.writeUInt8(channel, 1);
    buf.writeUInt16BE(sequence, 2);
    buf.writeUInt16BE(data.byteLength, 4);

    return Buffer.concat([buf, data]);
}
