import fs from 'fs';
import path from 'path';
import { input, Options } from '../src';

/* eslint-disable no-console */
(async () => {
  try {
    const inputPath = path.join(__dirname, '../test/files/sample.pdf');
    const outputPath = path.join(__dirname, '../test/files/sample');
    const options: Options = {
      format: 'png',
      scale: { x: 300, y: 400 },
    };
    const res = await input(inputPath, options).output();
    console.log(res);

    const res2 = await input(inputPath, options).output(outputPath);
    console.log(res2);


    const inputBuf = fs.readFileSync(inputPath);
    const res3 = await input(inputBuf, options).output();
    console.log(res3);
  } catch (error) {
    console.log(error);
  }
})();
