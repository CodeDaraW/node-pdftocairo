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
The first argument of `input` can be a file path or buffer.  
If you pass a output file path to `output`, it will generate files and returns `Promise<null>`; otherwise return buffers without generating files.

**Generate file buffer(s) from a PDF file**
``` typescript
const inputPath = path.join(__dirname, '../test/files/sample.pdf');
const options = { format: 'png' };
const outputBuffer = await input(inputPath, options).output();
```

**Generate file buffer(s) from the buffer**
``` typescript
const inputPath = path.join(__dirname, '../test/files/sample.pdf');
const buffer = fs.readFileSync(inputPath);
const options = { format: 'png' };
const outputBuffer = await input(buffer, options).output();
```

**Generate file(s) on the specified output path**
``` typescript
const inputPath = path.join(__dirname, '../test/files/sample.pdf');
const outputPath = path.join(__dirname, '../test/files/sample-img');
const options = { format: 'png' };
await input(inputPath, options).output(outputPath);
```

**Get the pdftocairo version**
``` typescript
import { version } from 'node-pdftocairo';

const versionString = await version();
// versionString will be something like:
// pdftocairo version 0.86.1
// Copyright 2005-2020 The Poppler Developers - http://poppler.freedesktop.org
// Copyright 1996-2011 Glyph & Cog, LLC

```

### Options
Reference: [Ubuntu Manpage: pdftocairo](http://manpages.ubuntu.com/manpages/bionic/man1/pdftocairo.1.html)  

| Property | Description | Type | Default |
|---|---|---|---|
| `bin` | specify the path of `pdftocairo` | `string` | - |
| `format` | output file format, should be one of `png` `jpeg` `tiff` `ps` `eps` `pdf` `svg` | `string` | - |
| `antialias` | Set the cairo antialias option used for text and drawing in image files (or rasterized regions in vector output), should be one of `default` `none` `gray` `subpixel` `fast` `good` `best` | `string` | - |
| `range` | Specifies the first/last page to convert. |`{ f?: number, l?: number }`| - |
| `filter` | Generates only the `odd` or `even` numbered pages. | `string` | - |
| `singlefile` | Writes only the first page and does not add digits. | `boolean` | `false` |
| `resolution` | Specifies the X and Y resolution, in pixels per inch of image files (or rasterized regions in vector output). The default is 150 PPI. | `number` \| `{ x: number, y: number }` | - |
| `scale` | Scales the long side of each page (width for landscape pages, height for portrait pages) to fit in scale-to pixels. The size of the short side will be determined by the aspect ratio of the page (PNG/JPEG/TIFF only). | `number` \| `{ x: number, y: number }` | - |
| `crop` | Specifies the x-coordinate/y-coordinate of the crop area top left corner in pixels (image output) or points (vector output) and Specifies the width/height/size of crop area in pixels (image output) or points (vector output) (default is 0) | `{ x?: number, y?: number, W?: number, H?: number, sz?: number }` | - |
| `cropbox` | Uses the crop box rather than media box when generating the files (PNG/JPEG/TIFF only) | `boolean` | `false` |
| `mono` | Generate a monochrome file (PNG and TIFF only). | `boolean` | `false` |
| `gray` | Generate a grayscale file (PNG, JPEG, and TIFF only). | `boolean` | `false` |
| `transparent` | Use a transparent page color instead of white (PNG and TIFF only). | `boolean` | `false` |
| `level2` | Generate Level 2 PostScript (PS only). | `boolean` | `false` |
| `level3` | Generate Level 3 PostScript (PS only). This enables all Level 2 features plus shading patterns and masked images. This is the default setting. | `boolean` | `false` |
| `originPageSizes` | This option is the same as "-paper match". | `boolean` | `false` |
| `icc` | Use the specified ICC file as the output profile (PNG only). The profile will be embedded in the PNG file. | `string` | - |
| `jpegopt` | When used with -jpeg, takes a list of options to control the jpeg compression. See JPEG OPTIONS for the available options. | `string` | - |
| `paper` | Set the paper size to one of "letter", "legal", "A4", or "A3" (PS,PDF,SVG only). This can also be set to "match", which will set the paper size of each page to match the size specified in the PDF file. If none the -paper, -paperw, or -paperh options are specified the default is to match the paper size. | `string` \| `{ w: number, h: number }`| - |
| `nocrop` | By default, printing output is cropped to the CropBox specified in the PDF file. This option disables cropping (PS,PDF,SVG only). | `boolean` | `false` |
| `expand` | Expand PDF pages smaller than the paper to fill the paper (PS,PDF,SVG only). By default, these pages are not scaled.| `boolean` | `false` |
|`noshrink`| Don't scale PDF pages which are larger than the paper (PS,PDF,SVG only). By default, pages larger than the paper are shrunk to fit. | `boolean` | `false` |
| `nocenter` | By default, PDF pages smaller than the paper (after any scaling) are centered on the paper. This option causes them to be aligned to the lower-left corner of the paper instead (PS,PDF,SVG only). | `boolean` | `false` |
| `duplex` | Adds the %%IncludeFeature: *Duplex DuplexNoTumble DSC comment to the PostScript file (PS only). This tells the print manager to enable duplexing. | `boolean` | `false` |
| `ownerPassword` | Specify the owner password for the PDF file. Providing this will bypass all security restrictions. | `string` | - |
| `userPassword` | Specify the user password for the PDF file. | `string` | - |
