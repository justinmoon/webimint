# Webimint

A fedimint client for the web

# Running

```
cargo install wasm-pack
npm install
npm run build:wasm
npm run start
```

# Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.MD) for a note about licensing of contributions.

On an M1 I had [trouble compiling rust-secp256k1 for wasm-unknown-unknown](https://github.com/rust-bitcoin/rust-secp256k1/issues/283). `source env.sh` before running `npm run build:wasm` will fix that problem. Hopefully adding a `flake.nix` will fix this problem more simply.


