I added Typescript and React to https://github.com/rust-analyzer/rust-analyzer-wasm, converted the Webworker files to .ts and created a reusable React component from the provided Monaco editor. Still just a very early prototype.

To run:

```shell
$ wasm-pack build --target web
$ cd www
$ yarn
$ yarn start
```
