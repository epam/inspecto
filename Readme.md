# Inspecto

## Indigo integration
### Building
Indigo provides a subset of its API as wasm files.   
Right now project already have a file `indigo-ketcher.js` which is compiled version of those APIs.

There's an [instruction](https://github.com/epam/Indigo#how-to-build-indigo-wasm) on how to compile wasm file from a given version of Indigo.    
However, there are some alterations you will need to make in order to compile successfully.    
1. Follow instruction to install all the dependencies.
2. After downloading source code checkout to particular stable version of Indigo you want to use, e.g. `git checkout indigo-1.14.0`
3. On `Now build` step instead of `ninja indigo-ketcher-js-test` do `ninja indigo-ketcher`.
4. If there are build errors try doing whole [build](https://github.com/epam/Indigo#build-instruction) instead. Perhaps some libraries are missing as dependencies. After building whole project delete build folder completely and create it again.
5. The result of the build will be inside `./build/bin/` folder. 

### Using
There's no detailed documentation about indigo-wasm apart from [readme](https://github.com/epam/Indigo/tree/master/api/wasm/indigo-ketcher)
and source code.    
You can check [cpp source code](https://github.com/epam/Indigo/blob/master/api/wasm/indigo-ketcher/indigo-ketcher.cpp) or [js test](https://github.com/epam/Indigo/blob/master/api/wasm/indigo-ketcher/test/test.js) to see what APIs are provided by Indigo.
File `indigo-ketcher.d.ts` provides dummy types for module itself and convert function.    

Convert is as a function which receives string and outputs string.
All possible types can be extracted from the ketcher source files.

Current file was produced with:
* node-16.20.0-64bit
* emsdk-3.1.52

Using different node version may require recompile from scratch.    

In theory, there should be a standalone wasm file, without extra .js code,
clarification from indigo team should be obtained.

## Proposal

Converting any input file to ket will allow developers to take advantage of ketcher code.
ketcher-core project has a lot of helpers related to ket files e.g. [schema](https://github.com/epam/ketcher/blob/master/packages/ketcher-core/src/domain/serializers/ket/schema.json), [serializer](https://github.com/epam/ketcher/blob/master/packages/ketcher-core/src/domain/serializers/ket/ketSerializer.ts), etc.

First step will probably be converting string from Indigo to tree-like structure.    

