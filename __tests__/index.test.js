import { genDiff, eol } from '../src';

const rightFlatResult =
[
  '{',
  '   host: hexlet.io',
  ' + timeout: 20',
  ' - timeout: 50',
  ' - proxy: 123.234.53.22',
  ' + verbose: true',
  '}',
];

test('flat json difference', () => {
  const firstConfig = '__tests__/__fixtures__/before.json';
  const secondConfig = '__tests__/__fixtures__/after.json';
  expect(genDiff(firstConfig, secondConfig)).toBe(rightFlatResult.join(eol));
});

test('flat yaml difference', () => {
  const firstConfig = '__tests__/__fixtures__/before.yaml';
  const secondConfig = '__tests__/__fixtures__/after.yaml';
  expect(genDiff(firstConfig, secondConfig)).toBe(rightFlatResult.join(eol));
});

test('flat ini difference', () => {
  const firstConfig = '__tests__/__fixtures__/before.ini';
  const secondConfig = '__tests__/__fixtures__/after.ini';
  expect(genDiff(firstConfig, secondConfig)).toBe(rightFlatResult.join(eol));
});

// const rightTreeResult =
// [
//   '{',
//   '   common: {',
//   '      setting1: Value 1',
//   '    - setting2: 200',
//   '      setting3: true',
//   '    - setting6: {',
//   '         key: value',
//   '      }',
//   '    + setting4: blah blah',
//   '    + setting5: {',
//   '         key5: value5',
//   '      }',
//   '   }',
//   '   group1: {',
//   '   + baz: bars',
//   '   - baz: bas',
//   '      foo: bar',
//   '   }',
//   ' - group2: {',
//   '      abc: 12345',
//   '   }',
//   ' + group3: {',
//   '      fee: 100500',
//   '   }',
//   '}',
// ];
//
// test('tree json difference', () => {
//   const firstConfig = '__tests__/__fixtures__/before-tree.json';
//   const secondConfig = '__tests__/__fixtures__/after-tree.json';
//   expect(genDiff(firstConfig, secondConfig)).toBe(rightTreeResult.join(eol));
// });
//
// test('tree yaml difference', () => {
//   const firstConfig = '__tests__/__fixtures__/before-tree.yaml';
//   const secondConfig = '__tests__/__fixtures__/after-tree.yaml';
//   expect(genDiff(firstConfig, secondConfig)).toBe(rightTreeResult.join(eol));
// });
//
// test('tree ini difference', () => {
//   const firstConfig = '__tests__/__fixtures__/before-tree.ini';
//   const secondConfig = '__tests__/__fixtures__/after-tree.ini';
//   expect(genDiff(firstConfig, secondConfig)).toBe(rightTreeResult.join(eol));
// });
