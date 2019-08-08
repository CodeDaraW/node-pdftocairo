# node-pdftocairo
[![Build Status](https://travis-ci.org/CodeDaraW/node-pdftocairo.svg?branch=master)](https://travis-ci.org/CodeDaraW/node-pdftocairo)
[![Codecov](https://img.shields.io/codecov/c/github/CodeDaraW/node-pdftocairo)](https://codecov.io/gh/CodeDaraW/node-pdftocairo)
[![npm](https://img.shields.io/npm/v/node-pdftocairo)](https://www.npmjs.com/package/node-pdftocairo)
[![MIT](https://img.shields.io/npm/l/node-pdftocairo)](https://github.com/CodeDaraW/node-pdftocairo/blob/master/LICENSE)

Node.js wrapper for pdftocairo - PDF to PNG/JPEG/TIFF/PDF/PS/EPS/SVG using cairo  
Inspired by [jjwilly16/node-pdftk](https://github.com/jjwilly16/node-pdftk/)

## Requirements
Since `pdftocairo` is included in [Poppler](https://poppler.freedesktop.org/), you should install `Poppler` before using this library.

## Installation
``` shell
yarn add node-pdftocairo
```

``` typescript
import { input } from 'node-pdftocairo';
```

## API
### Simple Usage
**Generate PNG files from a PDF file**

``` typescript
const inputPath = path.join(__dirname, '../test/files/sample.pdf');
const options = { format: 'png' };
const outputBuffer = await input(inputPath, options).output();
```

### Options
TODO
