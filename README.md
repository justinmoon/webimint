# Webimint

A fedimint client for the web

# Developing

On an M1 I had [trouble compiling rust-secp256k1 for wasm-unknown-unknown](https://github.com/rust-bitcoin/rust-secp256k1/issues/283). `source env.sh` before running `npm run build:wasm` will fix that problem. Hopefully adding a `flake.nix` will fix this problem more simply.

