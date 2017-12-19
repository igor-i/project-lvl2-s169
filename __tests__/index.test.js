import { genDiff, eol } from '../src';

const rightResult =
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
  expect(genDiff(firstConfig, secondConfig)).toBe(rightResult.join(eol));
});

test('flat yaml difference', () => {
  const firstConfig = '__tests__/__fixtures__/before.yaml';
  const secondConfig = '__tests__/__fixtures__/after.yaml';
  expect(genDiff(firstConfig, secondConfig)).toBe(rightResult.join(eol));
});
