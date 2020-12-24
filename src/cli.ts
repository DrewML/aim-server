import { BossServer } from './BossServer';
import { AIMAuthServer } from './AIMAuthServer';

interface CLIOpts {
    authHost?: string;
    authPort?: string;
    bossHost?: string;
    bossPort?: string;
}

export async function cli(opts: CLIOpts) {
    const authServer = new AIMAuthServer({
        host: opts.authHost || '0.0.0.0',
        port: (opts.authPort && Number(opts.authPort)) || 5190,
    });

    const bossServer = new BossServer({
        host: opts.bossHost || '0.0.0.0',
        port: (opts.bossPort && Number(opts.bossPort)) || 5191,
    });

    const [auth, boss] = await Promise.all([
        authServer.start(),
        bossServer.start(),
    ]);

    console.log(`Auth Service listening on ${auth.address}:${auth.port}`);
    console.log(`Boss Service listening on ${boss.address}: ${boss.port}`);
}
