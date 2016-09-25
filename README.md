# ts-format-imports
[![Build Status](https://travis-ci.org/alexeibs/ts-format-imports.png)](https://travis-ci.org/alexeibs/ts-format-imports)
[![Coverage Status](https://coveralls.io/repos/github/alexeibs/ts-format-imports/badge.svg?branch=master)](https://coveralls.io/github/alexeibs/ts-format-imports?branch=master)

TypeScript import formatter powered by [TypeScript Compiler API](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API).

## Installation

```npm install -g ts-format-imports```

## Usage

```bash
$ ts-format-imports file1.ts file2.ts file3.ts
```
The command above will reformat import declarations and remove duplicate imports from the specified files.

For example, this:
```typescript
import {foo, bar} from 'modules/foo';
  import {bar} from 'modules/foo';
    import * as ts from 'typescript';
import {doSomething} from 'modues/boo';
```
after reformatting would look like
```typescript
import * as ts from 'typescript';

import {doSomething} from 'modues/boo';

import {bar} from 'modules/foo';
import {foo} from 'modules/foo';
```
