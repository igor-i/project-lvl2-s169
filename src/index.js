import fs from 'fs';
import yaml from 'js-yaml';
import ini from 'ini';
import path from 'path';
import _ from 'lodash';

export const eol = '\n';

const mappingParse = {
  '.json': JSON.parse,
  '.yaml': yaml.safeLoad,
  '.ini': ini.parse,
};

const parse = (fileContent, fileExt) => mappingParse[fileExt](fileContent);

const compare = (obj1, obj2) => {
  const keys = _.union(_.keys(obj1), _.keys(obj2));
  return keys.reduce((acc, key) => {
    const obj1HasKey = key in obj1;
    const obj2HasKey = key in obj2;
    const value1 = obj1[key];
    const value2 = obj2[key];
    if (obj1HasKey && !obj2HasKey) {
      return [...acc, {
        node: key,
        type: 'removed',
        from: value1,
        to: '',
      }];
    }
    if (!obj1HasKey && obj2HasKey) {
      return [...acc, {
        node: key,
        type: 'added',
        from: '',
        to: value2,
      }];
    }
    if ((obj1HasKey && obj2HasKey) && _.isObject(value1) && _.isObject(value2)) {
      return [...acc, {
        node: key,
        type: 'nested',
        children: compare(value1, value2),
      }];
    }
    if ((obj1HasKey && obj2HasKey) && (value1 === value2)) {
      return [...acc, {
        node: key,
        type: 'unchanged',
        from: value1,
        to: value2,
      }];
    }
    if ((obj1HasKey && obj2HasKey) && (value1 !== value2)) {
      return [...acc, {
        node: key,
        type: 'changed',
        from: value1,
        to: value2,
      }];
    }
    return acc;
  }, []);
};

const reportJson = (ast, level = 0) => {
  const getSpace = (lev) => {
    const i = (count, acc) =>
      (count === lev * 3 ? acc : i(count + 1, [...acc, ' ']));
    return i(0, []).join('');
  };

  const objToString = (obj, space = '') => {
    const str = _.keys(obj).reduce((acc, key) => [...acc, `   ${key}: ${obj[key]}`], []);
    return (['{', ...str, '}']).join(`${eol}${space}`);
  };

  const res = ast.map((n) => {
    switch (n.type) {
      case 'changed':
        return [
          _.isObject(n.to) ?
            `${getSpace(level)} + ${n.node}: ${objToString(n.to, getSpace(level + 1))}` :
            `${getSpace(level)} + ${n.node}: ${n.to}`,
          _.isObject(n.from) ?
            `${getSpace(level)} - ${n.node}: ${objToString(n.from, getSpace(level + 1))}` :
            `${getSpace(level)} - ${n.node}: ${n.from}`,
        ];
      case 'removed':
        return _.isObject(n.from) ?
          `${getSpace(level)} - ${n.node}: ${objToString(n.from, getSpace(level + 1))}` :
          `${getSpace(level)} - ${n.node}: ${n.from}`;
      case 'added':
        return _.isObject(n.to) ?
          `${getSpace(level)} + ${n.node}: ${objToString(n.to, getSpace(level + 1))}` :
          `${getSpace(level)} + ${n.node}: ${n.to}`;
      case 'unchanged':
        return `${getSpace(level)}   ${n.node}: ${n.to}`;
      case 'nested':
        return `${getSpace(level)}   ${n.node}: ${reportJson(n.children, level + 1)}`;
      default:
        return n;
    }
  });

  return _.flatten(['{', ...res, `${getSpace(level)}}`]).join(eol);
};

const reportPlain = (ast, parents = []) => {
  const mappingValue = {
    undefined: value => `value: ${value}`,
    boolean: value => `value: ${value}`,
    number: value => `value: ${value}`,
    string: value => `'${value}'`,
    object: () => 'complex value',
  };

  const res = ast.reduce((acc, n) => {
    const to = mappingValue[typeof n.to](n.to);
    const propName = [...parents, n.node].join('.');
    switch (n.type) {
      case 'changed':
        return [...acc, `Property '${propName}' was updated. From '${n.from}' to '${n.to}'`];
      case 'removed':
        return [...acc, `Property '${propName}' was removed`];
      case 'added':
        return [...acc, `Property '${propName}' was added with ${to}`];
      case 'unchanged':
        return acc;
      case 'nested':
        return [...acc, reportPlain(n.children, [...parents, n.node])];
      default:
        return acc;
    }
  }, []);

  return res.join(eol);
};

const mappingReport = {
  json: reportJson,
  plain: reportPlain,
};

const report = (ast, format = 'plain') => mappingReport[format](ast);

export const genDiff = (pathToFile1, pathToFile2, format) => {
  const fileContent1 = fs.readFileSync(pathToFile1, 'utf8');
  const fileContent2 = fs.readFileSync(pathToFile2, 'utf8');
  const fileExt1 = path.extname(pathToFile1);
  const fileExt2 = path.extname(pathToFile2);
  return report(compare(parse(fileContent1, fileExt1), parse(fileContent2, fileExt2)), format);
};
