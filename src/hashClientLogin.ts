import crypto from 'crypto';

/**
 * @summary Hashing algorithm uses by Oscar protocol clients.
 *          It's MD5 so it's suppperrrr insecure, but we don't
 *          control the client here so there aren't other options
 */
export function hashClientPassword(opts: { password: string; salt: string }) {
    const hashedPass = crypto
        .createHash('md5')
        .update(opts.password, 'ascii')
        .digest();

    return crypto
        .createHash('md5')
        .update(opts.salt, 'ascii')
        .update(hashedPass)
        .update('AOL Instant Messenger (SM)', 'ascii')
        .digest();
}
