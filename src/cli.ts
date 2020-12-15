import { AIMAuthServer } from './AIMAuthServer';

export function cli() {
    const server = new AIMAuthServer();
    server.listen();
}
