# AOL Instant Messenger Server

This is a (very wip) server-side implementation of the [Oscar Protocol](https://en.wikipedia.org/wiki/OSCAR_protocol), used by [AOL Instant Messenger](<https://en.wikipedia.org/wiki/AIM_(software)>) and later versions of [ICQ](https://en.wikipedia.org/wiki/ICQ).

## Working

-   Authentication Server
    -   Only supports the newer authentication mechanism (TLV 0x4c) because I don't want to deal with plaintext passwords
    -   Every username (no registration yet) can be used with the hardcoded password `password`

## Running

-   Set `AUTH_HOST` env var (defaults to `0.0.0.0`)
-   Set `AUTH_PORT` env var (defaults to `5190`)
-   Run `npm run build` to compile
-   Run `npm start` (or `bin/aimserver`)

## Oscar Clients

This has only been tested with AIM for Windows version `5.2.3292`, but theoretically should work with more clients.

## Oscar Protocol Resources

-   http://web.archive.org/web/20080308233204/http://dev.aol.com/aim/oscar/ (AOL published Oscar protocol documentation in the mid 00s)
-   http://iserverd.khstu.ru/oscar/ (Unofficial protocol docs, pretty thorough)
-   https://wiki.nina.bz/wiki/Protocols/OSCAR (From the Nina group also working on an OSCAR server)
-   https://github.com/bitm4ster/AOL-Instant-Messenger-Server/ (Oscar server written in VB6. and it actually compiles!)
-   http://iserverd.khstu.ru/download/ (Oscar Server written in C++. Haven't attempted to compile yet, but a great reference)
-   http://web.archive.org/web/20060113083940/http://joust.kano.net/wiki/oscar/moin.cgi/ (Unofficial protocol docs)

## Things I wish I knew before I started

-   The [unofficial docs I was following for SNAC 17,07](http://iserverd1.khstu.ru/oscar/snac_17_07.html) are wrong about the size of the auth key length field (should be 2 byte, docs say 4)
-   TLV "tags" (integer used to represent them) seem to be reused often. In other words, auth and boss servers can both have multiple TLV with tag 0x1, used for completely different things. They seem to change per request/response
