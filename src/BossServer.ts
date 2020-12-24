import assert from 'assert';
import { OscarServer, OscarSocket } from './OscarServer';

export class BossServer extends OscarServer {
    onConnection(oscarSocket: OscarSocket) {
        assert(false, 'onConnection not implemented in BossServer');
    }
}
