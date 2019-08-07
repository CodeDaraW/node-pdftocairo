import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { spawn } from 'child_process';
import glob from 'glob';
import rimraf from 'rimraf';

export interface Options {
  bin?: string;
  format: 'png' | 'jpeg' | 'tiff' | 'ps' | 'eps' | 'pdf' | 'svg';
  // range?: { f: number, l: number };
  // filter?: 'odd' | 'even' | 'single';
  // resolution?: number | { x: number, y: number };
  scale?: number | { x: number, y: number };
  // crop?: { x?: number, y?: number, W?: number, H?: number, box?: 'crop' | 'media' };
  // mono?: boolean;
  // gray?: boolean;
  // transparent?: boolean;
  // level2?: boolean;
  // level3?: boolean;
  // originPageSizes?: boolean;
  // icc?: string;
  // paper?: string | { w: number, h: number };
  // noCrop?: boolean;
  // expand?: boolean;
  // noShrink?: boolean;
  // noCenter?: boolean;
  // duplex?: boolean;
  // ownerPassword?: string;
  // userPassword?: string;
}

const DEFAULT_BIN = 'pdftocairo';

/**
 * @see http://manpages.ubuntu.com/manpages/bionic/man1/pdftocairo.1.html
 */
const ERROR_MESSAGES = {
  0: 'No error.',
  1: 'Error opening a PDF file.',
  2: 'Error opening an output file.',
  3: 'Error related to PDF permissions.',
  4: 'Error related to ICC profile.',
  99: 'Other error.',
};

const getOptionArgs = (options: Options): string[] => {
  const args: string[] = [];
  args.push(`-${options.format}`);

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
    const outputPath = outputFile || path.join(this.makeTempDir(), 'result');

    this.args.push(inputPath, outputPath);

    const child = spawn(this.bin, this.args, { shell: true });

    if (typeof this.input !== 'string') {
      child.stdin.setDefaultEncoding('utf-8');
      child.stdin.write(this.input);
      child.stdin.end();
    }

    return new Promise((resolve, reject) => {
      child.on('close', async code => {
        if (code !== 0) {
          reject(ERROR_MESSAGES[code]);
          return;
        }

        if (typeof outputFile === 'string') {
          resolve();
        } else {
          const files = await findFiles(`${outputPath}*`);
          const buffers = files.sort().map(file => fs.readFileSync(file));
          this.cleanUpTemp();
          resolve(buffers);
        }
      });
    });
  }

  private makeTempDir(): string {
    const uniqueId = crypto.randomBytes(16).toString('hex');
    const outputPath = path.join('/tmp', uniqueId);
    fs.mkdirSync(outputPath);
    this.tmps.push(outputPath);
    return outputPath;
  }

  private cleanUpTemp(): void {
    try {
      this.tmps.forEach(f => rimraf.sync(f));
    } catch (error) {
      // ignore
    }
  }
}

export const input = (file: string | Buffer, options: Options) => new PDFToCairo(file, options);
