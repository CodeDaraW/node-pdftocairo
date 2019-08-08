# node-pdftocairo
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
