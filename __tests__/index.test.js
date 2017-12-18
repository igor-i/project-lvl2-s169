import genDiff from '../src';

const eol = '\n';

test('flat json difference', () => {
  const firstConfig = '__tests__/__fixtures__/before.json';
  const secondConfig = '__tests__/__fixtures__/after.json';
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
  expect(genDiff(firstConfig, secondConfig)).toBe(rightResult.join(eol));
});
