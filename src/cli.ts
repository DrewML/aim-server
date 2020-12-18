import { AIMAuthServer } from './AIMAuthServer';

interface CLIOpts {
    authHost?: string;
    authPort?: string;
}

export async function cli(opts: CLIOpts) {
    const authServer = new AIMAuthServer({
        host: opts.authHost,
        port: (opts.authPort && Number(opts.authPort)) || undefined,
    });
    const { host, port } = await authServer.listen();
    console.log(`Auth Service listening on ${host}:${port}`);
}
