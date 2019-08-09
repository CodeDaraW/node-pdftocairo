import path from 'path';
import { input, Options } from '../src';

const samplePath = path.join(__dirname, '../test/files/sample.pdf');
const logoPath = path.join(__dirname, '../test/files/logo.pdf');

describe('options', () => {
  test('range', async () => {
    const options: Options = {
      format: 'png',
      range: { f: 1, l: 1 },
    };

    const res = await input(samplePath, options).output();
    expect(res.length).toBe(1);
  });

  test('filter', async () => {
    const options: Options = {
      format: 'png',
      filter: 'even',
    };

    const res = await input(samplePath, options).output();
    expect(res.length).toBe(1);
  });

  test('singlefile', async () => {
    const options: Options = {
      format: 'png',
      singlefile: true,
    };

    const res = await input(samplePath, options).output();
    expect(res.length).toBe(1);
  });

  test('resolution', async () => {
    const options: Options = {
      format: 'png',
      resolution: 120,
    };

    const res = await input(samplePath, options).output();
    expect(res.length).toBe(2);
  });

  test('resolution x & y', async () => {
    const options: Options = {
      format: 'png',
      resolution: { x: 120, y: 120 },
    };

    const res = await input(samplePath, options).output();
    expect(res.length).toBe(2);
  });

  test('scale', async () => {
    const options: Options = {
      format: 'png',
      scale: 2,
    };

    const res = await input(samplePath, options).output();
    expect(res.length).toBe(2);
  });

  test('scale x & y', async () => {
    const options: Options = {
      format: 'png',
      scale: { x: 300, y: 300 },
    };

    const res = await input(samplePath, options).output();
    expect(res.length).toBe(2);
  });

  test('paper', async () => {
    const options: Options = {
      format: 'pdf',
      paper: 'A3',
    };

    const res = await input(samplePath, options).output();
    expect(res.length).toBe(1);
  });

  test('paper w & h', async () => {
    const options: Options = {
      format: 'pdf',
      paper: {
        w: 100,
        h: 200,
      },
    };

    const res = await input(samplePath, options).output();
    expect(res.length).toBe(1);
  });

  test('crop', async () => {
    const options: Options = {
      format: 'png',
      crop: {
        x: 300, y: 300, H: 100, W: 100, sz: 50,
      },
    };

    const res = await input(samplePath, options).output();
    expect(res.length).toBe(2);
  });

  test('cropbox', async () => {
    const options: Options = {
      format: 'png',
      cropbox: true,
    };

    const res = await input(samplePath, options).output();
    expect(res.length).toBe(2);
  });

  test('mono', async () => {
    const options: Options = {
      format: 'png',
      mono: true,
    };

    const res = await input(logoPath, options).output();
    expect(res.length).toBe(1);
  });

  test('gray', async () => {
    const options: Options = {
      format: 'png',
      gray: true,
    };

    const res = await input(logoPath, options).output();
    expect(res.length).toBe(1);
  });
});
