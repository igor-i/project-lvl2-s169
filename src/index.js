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
  return Array.from(keys).reduce((acc, key) => {
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

const report = (ast) => {
  const resultStrings = ast.reduce((acc, node) => {
    switch (node.type) {
      case 'changed':
        return [...acc, ` + ${node.node}: ${node.to}`, ` - ${node.node}: ${node.from}`];
      case 'removed':
        return [...acc, ` - ${node.node}: ${node.from}`];
      case 'added':
        return [...acc, ` + ${node.node}: ${node.to}`];
      case 'unchanged':
        return [...acc, `   ${node.node}: ${node.to}`];
      default:
        return acc;
    }
  }, []);

  return ['{', ...resultStrings, '}'].join(eol);
};

export const genDiff = (pathToFile1, pathToFile2) => {
  const fileContent1 = fs.readFileSync(pathToFile1, 'utf8');
  const fileContent2 = fs.readFileSync(pathToFile2, 'utf8');
  const fileExt1 = path.extname(pathToFile1);
  const fileExt2 = path.extname(pathToFile2);
  return report(compare(parse(fileContent1, fileExt1), parse(fileContent2, fileExt2)));
};
