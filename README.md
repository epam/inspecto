# 🔍 Inspecto

<p align="center">
  <strong>A molecular validation tool to ensure chemical structures satisfy chemical rules</strong>
</p>

[![License: Apache](https://img.shields.io/badge/License-Apache-yellow.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.0-blue)](https://www.typescriptlang.org/)

## 📋 Table of Contents

- [Definition](#-definition)
- [Installation](#-installation)
- [Usage](#-usage)
- [API](#-api)
- [Development](#-development)
- [Technology Stack](#-technology-stack)
- [Package Structure](#-package-structure)

## 🧪 Definition

Inspecto is a molecular checker that validates chemical structures to ensure they satisfy chemical rules.

## 🚀 Installation

### Prerequisites

- Node.js (v14 or later)
- pnpm

### Install Dependencies

```bash
pnpm install
```

### Build the Package

```bash
pnpm run build
```

## 🛠️ Usage

### Development Mode

#### Update Demo in Run-time

Run in one terminal:

```bash
pnpm run dev
```

After changing files, the demo will update automatically.

### Local Testing

To execute tests run

```bash
pnpm run test
```

### Ketcher Update

To update Ketcher, run:

```bash
pnpm run update-ketcher
```

## 📘 API

See the corresponding Knowledge Base page for detailed [API documentation](https://github.com/epam/inspecto/wiki/API).

## 💻 Development

For instructions on how to add new validation rules, see the [Creating a New Rule](./creating-new-rule.md) guide.

For instructions on how to apply rules, see the [Apply rules](https://github.com/epam/inspecto/wiki/How-to:-Apply-rules) guide.

List of available Rule Descriptions may be found [here](https://github.com/epam/inspecto/wiki/Rules).

Data model described on this [page](https://github.com/epam/inspecto/wiki/Data-Model).

### Technology Stack

#### Dependencies

- 📦 [Typescript](https://www.typescriptlang.org/) - Typed JavaScript
- 🔄 [Inversify](https://inversify.io/) - Dependency injection container
- ⚗️ [Indigo WASM](https://www.pnpmjs.com/package/indigo-ketcher) - Chemistry toolkit

#### Development Tools

- 🔥 [Vite](https://vitejs.dev/) - Next generation frontend tooling
- 🧹 [ESlint](https://eslint.org/) - Linting utility
- ✨ [Prettier](https://prettier.io/) - Code formatter
- 🧪 [Vitest](https://vitest.dev/) - Testing framework

### Package Structure

Inspecto is organized into three main modules:

#### 🧩 Main Modules

- **inspecto** - Source code for Inspecto API
- **rules** - Source code for RulesManager and rules
- **utils** - Set of useful functions to support calculations

The modules "inspecto" and "rules" are built using IoC design principles to provide low coupling for dependencies (using DI technique).

#### 📐 Architecture Components

- **processor** - Entry point for the package or responsible for a particular business domain/process (e.g., "Rules")
- **provider** - Wrapper around APIs with physical I/O (file system, etc.), 3rd party libs, and APIs with remote services
- **infrastructure** - Required project structure entities (injection tokens, TS types, etc.)
- **models** - Required entities for Data Modeling

## 📄 License

[Apache](./LICENSE)
