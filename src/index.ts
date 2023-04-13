import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { spawn } from 'child_process';
import glob from 'glob';
import rimraf from 'rimraf';

export interface Options {
  bin?: string;
  format: 'png' | 'jpeg' | 'tiff' | 'ps' | 'eps' | 'pdf' | 'svg';
  antialias?: 'default' | 'none' | 'gray' | 'subpixel' | 'fast' | 'good' | 'best';
  range?: { f?: number, l?: number };
  filter?: 'odd' | 'even';
  singlefile?: boolean;
  resolution?: number | { x: number, y: number };
  scale?: number | { x: number, y: number };
  crop?: { x?: number, y?: number, W?: number, H?: number, sz?: number };
  cropbox?: boolean;
  mono?: boolean;
  gray?: boolean;
  transparent?: boolean;
  level2?: boolean;
  level3?: boolean;
  originPageSizes?: boolean;
  icc?: string;
  jpegopt?: string;
  paper?: string | { w: number, h: number };
  nocrop?: boolean;
  expand?: boolean;
  noshrink?: boolean;
  nocenter?: boolean;
  duplex?: boolean;
  ownerPassword?: string;
  userPassword?: string;
}

const DEFAULT_BIN = 'pdftocairo';

const getOptionArgs = (options: Options): string[] => {
  const args: string[] = [];
  args.push(`-${options.format}`);

  if (options.range) {
    if (typeof options.range.f === 'number') args.push(`-f ${options.range.f}`);
    if (typeof options.range.l === 'number') args.push(`-l ${options.range.l}`);
  }

  if (options.filter) {
    const arg = options.filter === 'odd' ? '-o' : '-e';
    args.push(arg);
  }

  if (options.singlefile) args.push('-singlefile');

  if (options.resolution) {
    if (typeof options.resolution === 'number') {
      args.push(`-r ${options.resolution}`);
    } else {
      if (typeof options.resolution.x === 'number') {
        args.push(`-rx ${options.resolution.x}`);
      }
      if (typeof options.resolution.y === 'number') {
        args.push(`-ry ${options.resolution.y}`);
      }
    }
  }

  if (options.scale) {
    if (typeof options.scale === 'number') {
      args.push(`-scale-to ${options.scale}`);
    } else {
      if (typeof options.scale.x === 'number') {
        args.push(`-scale-to-x ${options.scale.x}`);
      }
      if (typeof options.scale.y === 'number') {
        args.push(`-scale-to-y ${options.scale.y}`);
      }
    }
  }

  if (options.paper) {
    if (typeof options.paper === 'string') {
      args.push(`-paper ${options.paper}`);
    } else {
      if (typeof options.paper.w === 'number') {
        args.push(`-paperw ${options.paper.w}`);
      }
      if (typeof options.paper.h === 'number') {
        args.push(`-paperh ${options.paper.h}`);
      }
    }
  }

  if (options.crop) {
    if (options.crop.x) args.push(`-x ${options.crop.x}`);
    if (options.crop.y) args.push(`-y ${options.crop.y}`);
    if (options.crop.H) args.push(`-H ${options.crop.H}`);
    if (options.crop.W) args.push(`-W ${options.crop.W}`);
    if (options.crop.sz) args.push(`-sz ${options.crop.sz}`);
  }

  if (options.cropbox) args.push('-cropbox');
  if (options.mono) args.push('-mono');
  if (options.gray) args.push('-gray');
  if (options.antialias) args.push(`-antialias ${options.antialias}`);
  if (options.level2) args.push('-level2');
  if (options.level3) args.push('-level3');
  if (options.transparent) args.push('-transp');
  if (options.originPageSizes) args.push('-origpagesizes');
  if (options.icc) args.push(`-icc ${options.icc}`);
  if (options.jpegopt) args.push(`-jpegopt ${options.jpegopt}`);
  if (options.nocrop) args.push('-nocrop');
  if (options.expand) args.push('-expand');
  if (options.noshrink) args.push('-noshrink');
  if (options.nocenter) args.push('-nocenter');
  if (options.duplex) args.push('-duplex');
  if (options.ownerPassword) args.push(`-opw ${options.ownerPassword}`);
  if (options.userPassword) args.push(`-upw ${options.userPassword}`);

  args.push('-q');

  return args;
};

const findFiles = async (patten: string): Promise <string[]> => new Promise((resolve, reject) => {
  glob(patten, (err, files) => (err ? reject(err) : resolve(files)));
});

class PDFToCairo {
  private bin: string;

  private args: string[] = [];

  private input: string | Buffer;

  private tmps: string[] = [];

  public constructor(file: string | Buffer, options: Options) {
    this.input = file;
    this.bin = options.bin || process.env.PDFTOCAIRO_PATH || DEFAULT_BIN;
    this.args.push(...getOptionArgs(options));
  }

  // overload signature
  public async output(): Promise<Buffer[]>;

  public async output(outputFile: string): Promise<null>;

  public async output(outputFile?: string): Promise<Buffer[] | null> {
    // '-' means reading PDF file from stdin
    const inputPath = typeof this.input === 'string' ? this.input : '-';
    const outputPath = outputFile || path.join(await this.makeTempDir(), 'result');

    this.args.push(inputPath, outputPath);

    const child = spawn(this.bin, this.args, { shell: true });

    if (typeof this.input !== 'string') {
      child.stdin.setDefaultEncoding('utf-8');
      child.stdin.write(this.input);
      child.stdin.end();
    }

    return new Promise((resolve, reject) => {
      let errMsg: string;
      child.stderr.on('data', (data) => {
        errMsg = `${data}`;
      });

      child.on('close', async (code) => {
        if (code !== 0) {
          reject(new Error(`[code ${code}] ${errMsg || 'unknown error'}`));
          return;
        }

        if (typeof outputFile === 'string') {
          resolve(null);
        } else {
          const files = await findFiles(`${outputPath}*`);
          const buffers = await Promise.all(
            files.sort().map((file) => fs.promises.readFile(file)),
          );
          this.cleanUpTemp();
          resolve(buffers);
        }
      });
    });
  }

  private async makeTempDir(): Promise<string> {
    const uniqueId = crypto.randomBytes(16).toString('hex');
    const outputPath = path.join('/tmp', uniqueId);
    await fs.promises.mkdir(outputPath);
    this.tmps.push(outputPath);
    return outputPath;
  }

  private cleanUpTemp(): void {
    try {
      this.tmps.forEach((f) => rimraf.sync(f));
    } catch (error) {
      // ignore
    }
  }
}

export const input = (file: string | Buffer, options: Options) => new PDFToCairo(file, options);
