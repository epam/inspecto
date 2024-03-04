# Inspecto

## Definition

Inspecto is a molecular checker to validate them to satisfy chemical rules.

## Usage

### Installation

#### Install dependencies

> npm install

#### Build the package

> npm run build

#### Local testing

For development purposes run the following command in the root of the project

> npm run link

As a result there is an updated package called 'inspecto' in the NPM dependecy graph.

### Inspecto API

> See corresponded KB page to look through existing API.

## Development

### Technology stack

#### Dependencies

- [Typescript](https://www.typescriptlang.org/)
- [Inversify](https://inversify.io/)
- [Indigo WASM](https://www.npmjs.com/package/indigo-ketcher)

#### Developmnent tools

- [Vite](https://vitejs.dev/)
- [ESlint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Jest](https://jestjs.io/)

#### Package structure

The package is built using IoC design principle to provide low coupling for dependencies (using DI technique).

- processor

This is a entity that is entry point for the package or that is responsible for one particular business domain and/or process. For instance, "Rules".

- provider

This is an entity that is wrapper around API with physical I/O (file system and etc), 3rd party libs and API with remote services.

- infrastrcture

Contains required for the project structure entities, like, injection tokens, TS types and etc.

- models

Contains required entities for Data Modeling

- utils

Contain helping functions for calculations
