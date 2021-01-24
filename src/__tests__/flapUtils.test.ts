import test from 'tape';
import { buildFlap, parseFlaps } from '../flapUtils';

test('buildFlap throws on invalid flap frame type', (t) => {
    t.plan(1);
    const fn = () =>
        buildFlap({
            type: 7,
            sequence: 0,
            data: Buffer.alloc(0),
        });
    t.throws(fn, /Unexpected Flap Frame Type/);
});

test('buildFlap constructs a valid FLAP buffer', (t) => {
    const flap = buildFlap({
        type: 1,
        sequence: 0,
        data: Buffer.from([0x0]),
    });

    t.equal(flap.readUInt8(0), 0x2a, 'wrong start byte');
    t.equal(flap.readUInt8(1), 1, 'wrong type');
    t.equal(flap.readUInt16BE(2), 0, 'wrong sequence num');
    t.equal(flap.readUInt16BE(4), 1, 'wrong data size');
    t.equal(flap.readUInt8(6), 0, 'wrong data');
    t.equal(flap.subarray(7).byteLength, 0, 'extra data in flap');
    t.end();
});

test('parseFlap parses a single valid FLAP', (t) => {
    // prettier-ignore
    const rawFlap = Buffer.from([
        0x2a, // flap start byte
        0x1, // flap type
        0x0, 0x1, // sequence num
        0x0, 0x1, // data length
        0x0 // data
    ]);
    const [flap] = parseFlaps(rawFlap);
    t.equal(flap.type, 1);
    t.equal(flap.sequence, 1);
    t.equal(flap.byteLength, 1);
    t.equal(flap.data.readUInt8(), 0);
    t.end();
});

test('parseFlap parses 2 valid FLAPs', (t) => {
    // prettier-ignore
    const rawFlaps = Buffer.from([
        0x2a, // flap start byte
        0x1, // flap type
        0x0, 0x1, // sequence num
        0x0, 0x1, // data length
        0x0, // data

        0x2a, // flap start byte
        0x2, // flap type
        0x0, 0x2, // sequence num
        0x0, 0x2, // data length
        0x0, 0x0 // data
    ]);

    const [flap1, flap2] = parseFlaps(rawFlaps);
    t.equal(flap1.type, 1);
    t.equal(flap1.byteLength, 1);
    t.equal(flap2.type, 2);
    t.equal(flap2.byteLength, 2);
    t.end();
});

test('parseFlap throws when missing flap start byte in first flap', (t) => {
    // prettier-ignore
    const rawFlap = Buffer.from([
        0x1, // (wrong) flap start byte
        0x1, // flap type
        0x0, 0x1, // sequence num
        0x0, 0x1, // data length
        0x0 // data
    ]);
    t.throws(() => parseFlaps(rawFlap), 'Unexpected Flap ID');
    t.end();
});

test.skip('parseFlap throws when flap data exceeds claimed size', () => {});
