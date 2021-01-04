import test from 'tape';
import { buildFlap, parseFlap } from '../flapUtils';

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
