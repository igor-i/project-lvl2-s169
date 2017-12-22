import genDiff from '../src';
import { eol } from '../src/renderers';

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
  expect(genDiff(firstConfig, secondConfig, 'pretty')).toBe(rightFlatResult.join(eol));
});

test('flat yaml difference', () => {
  const firstConfig = '__tests__/__fixtures__/before.yaml';
  const secondConfig = '__tests__/__fixtures__/after.yaml';
  expect(genDiff(firstConfig, secondConfig, 'pretty')).toBe(rightFlatResult.join(eol));
});

test('flat ini difference', () => {
  const firstConfig = '__tests__/__fixtures__/before.ini';
  const secondConfig = '__tests__/__fixtures__/after.ini';
  expect(genDiff(firstConfig, secondConfig, 'pretty')).toBe(rightFlatResult.join(eol));
});

const rightTreeResult =
[
  '{',
  '   common: {',
  '      setting1: Value 1',
  '    - setting2: 200',
  '      setting3: true',
  '    - setting6: {',
  '         key: value',
  '      }',
  '    + setting4: blah blah',
  '    + setting5: {',
  '         key5: value5',
  '      }',
  '   }',
  '   group1: {',
  '    + baz: bars',
  '    - baz: bas',
  '      foo: bar',
  '   }',
  ' - group2: {',
  '      abc: 12345',
  '   }',
  ' + group3: {',
  '      fee: 100500',
  '   }',
  '}',
];

test('tree json difference', () => {
  const firstConfig = '__tests__/__fixtures__/before-tree.json';
  const secondConfig = '__tests__/__fixtures__/after-tree.json';
  expect(genDiff(firstConfig, secondConfig, 'pretty')).toBe(rightTreeResult.join(eol));
});

test('tree yaml difference', () => {
  const firstConfig = '__tests__/__fixtures__/before-tree.yaml';
  const secondConfig = '__tests__/__fixtures__/after-tree.yaml';
  expect(genDiff(firstConfig, secondConfig, 'pretty')).toBe(rightTreeResult.join(eol));
});

test('tree ini difference', () => {
  const firstConfig = '__tests__/__fixtures__/before-tree.ini';
  const secondConfig = '__tests__/__fixtures__/after-tree.ini';
  expect(genDiff(firstConfig, secondConfig, 'pretty')).toBe(rightTreeResult.join(eol));
});

const rightPlainReport = [
  'Property \'timeout\' was updated. From \'50\' to \'20\'',
  'Property \'proxy\' was removed',
  'Property \'common.setting4\' was removed',
  'Property \'common.setting5\' was removed',
  'Property \'common.setting2\' was added with value: 200',
  'Property \'common.setting6\' was added with complex value',
  'Property \'common.sites\' was added with complex value',
  'Property \'group1.baz\' was updated. From \'bars\' to \'bas\'',
  'Property \'group3\' was removed',
  'Property \'verbose\' was added with value: true',
  'Property \'group2\' was added with complex value',
];

test('plain report', () => {
  const firstConfig = '__tests__/__fixtures__/before-plain.json';
  const secondConfig = '__tests__/__fixtures__/after-plain.json';
  expect(genDiff(firstConfig, secondConfig, 'plain')).toBe(rightPlainReport.join(eol));
});

const rightJsonReport = '[{"node":"host","type":"unchanged","from":"hexlet.io","to":"hexlet.io"},{"node":"timeout","type":"changed","from":50,"to":20},{"node":"proxy","type":"removed","from":"123.234.53.22"},{"node":"verbose","type":"added","to":true}]';

test('json report', () => {
  const firstConfig = '__tests__/__fixtures__/before.json';
  const secondConfig = '__tests__/__fixtures__/after.json';
  expect(genDiff(firstConfig, secondConfig, 'json')).toBe(rightJsonReport);
});
