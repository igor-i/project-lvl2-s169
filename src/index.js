import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parse from './parsers';
import generateReport from './reportgenerators';

const genDiffToAst = (obj1, obj2) => {
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
        children: genDiffToAst(value1, value2),
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

export default (pathToFile1, pathToFile2, format) => {
  const fileContent1 = fs.readFileSync(pathToFile1, 'utf8');
  const fileContent2 = fs.readFileSync(pathToFile2, 'utf8');
  const fileExt1 = path.extname(pathToFile1);
  const fileExt2 = path.extname(pathToFile2);
  const ast = genDiffToAst(parse(fileContent1, fileExt1), parse(fileContent2, fileExt2));
  return generateReport(ast, format);
};
