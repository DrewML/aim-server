import { timingSafeEqual } from 'crypto';
import { parseCookieRequest } from './clientSnacs';
import { OscarServer, OscarSocket } from '../OscarServer';
import { supportedFamiliesSnac } from './serverSnacs';
import { assert } from 'console';

export class BossServer extends OscarServer {
    onConnection(oscarSocket: OscarSocket) {
        const { host, port } = oscarSocket.remoteAddress;
        console.log(`BossServer: New connection from ${host}:${port}`);

        oscarSocket.sendStartFlap();

        oscarSocket.onChannel(0x1, (flap) => {
            const { authCookie } = parseCookieRequest(flap.data);
            // TODO: Grab cookie from shared storage with auth service
            const expectedCookie = Buffer.from('111111111', 'ascii');
            const validCookie = timingSafeEqual(authCookie, expectedCookie);

            // TODO: Unsure of what client expects for invalid cookie,
            //       maybe close via channel 4?
            assert(validCookie, 'BossServer: Invalid auth cookie');

            const snac = supportedFamiliesSnac({ reqID: 1 });
            oscarSocket.write({ channel: 2, data: snac });
        });

        oscarSocket.onChannel(0x2, (flap) => {
            console.log('boss channel 2 flap: ', flap);
        });

        oscarSocket.onChannel(0x3, (flap) => {
            console.log('boss channel 3 flap: ', flap);
        });

        oscarSocket.onChannel(0x4, (flap) => {
            console.log('boss channel 4 flap: ', flap);
        });

        oscarSocket.onChannel(0x5, (flap) => {
            console.log('boss channel 5 flap: ', flap);
        });
    }
}
