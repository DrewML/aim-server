import crypto from 'crypto';

/**
 * @summary Hashing algorithm used by Oscar protocol clients.
 *          It's MD5 so it's suppperrrr insecure, but we don't
 *          control the client here so there aren't other options.
 *
 *          The original AIM clients (at least through version 5.x)
 *          did not use TLS or SSL by default, so passwords were
 *          double-hashed, along with a salt, to prevent sending
 *          passwords over a plaintext connection
 *
 * @see http://web.archive.org/web/20140707182132/http://iserverd1.khstu.ru/oscar/snac_17_02.html
 */
export function hashClientPassword(opts: { password: string; salt: string }) {
    const hashedPass = crypto
        .createHash('md5')
        // second round of hashing for the already-hashed pass
        .update(opts.password, 'ascii')
        .digest();

    return crypto
        .createHash('md5')
        .update(opts.salt, 'ascii')
        .update(hashedPass)
        .update('AOL Instant Messenger (SM)', 'ascii')
        .digest();
}
