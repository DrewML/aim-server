import test from 'tape';
import { buildSnac } from '../snacUtils';

test('buildSnac constructs a valid SNAC buffer', (t) => {
    const snac = buildSnac({
        family: 0x1,
        subtype: 0x2,
        flags: 0,
        reqID: 1,
        data: Buffer.from([0x0]),
    });

    t.equal(snac.readUInt16BE(0), 0x1, 'wrong snac family');
    t.equal(snac.readUInt16BE(2), 0x2, 'wrong snac subtype');
    t.equal(snac.readUInt16BE(4), 0x0, 'wrong snac flags');
    t.equal(snac.readUInt32BE(6), 0x1, 'wrong snac reqID');
    t.equal(snac.readUInt8(10), 0x0, 'wrong snac data');
    t.equal(
        snac.subarray(11).byteLength,
        0,
        'snac data exceeds size of provided data',
    );
    t.end();
});
