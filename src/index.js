import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parse from './parsers';
import getRenderer from './renderers';

const changesTypeActions = [
  {
    type: 'removed',
    check: (obj1, obj2, nodeName) => _.has(obj1, nodeName) && !_.has(obj2, nodeName),
    process: (oldValue, newValue) => ({ from: oldValue, to: newValue }),
  },
  {
    type: 'added',
    check: (obj1, obj2, nodeName) => !_.has(obj1, nodeName) && _.has(obj2, nodeName),
    process: (oldValue, newValue) => ({ from: oldValue, to: newValue }),
  },
  {
    type: 'unchanged',
    check: (obj1, obj2, nodeName) =>
      _.has(obj1, nodeName) && _.has(obj2, nodeName) && (obj1[nodeName] === obj2[nodeName]),
    process: (oldValue, newValue) => ({ from: oldValue, to: newValue }),
  },
  {
    type: 'changed',
    check: (obj1, obj2, nodeName) =>
      _.has(obj1, nodeName) && _.has(obj2, nodeName) && (obj1[nodeName] !== obj2[nodeName]) &&
      !_.isObject(obj1[nodeName]) && !_.isObject(obj2[nodeName]),
    process: (oldValue, newValue) => ({ from: oldValue, to: newValue }),
  },
  {
    type: 'nested',
    check: (obj1, obj2, nodeName) =>
      _.has(obj1, nodeName) && _.has(obj2, nodeName) &&
      _.isObject(obj1[nodeName]) && _.isObject(obj2[nodeName]),
    process: (oldValue, newValue, fn) => ({ children: fn(oldValue, newValue) }),
  },
];

const getChangesTypeAction = (obj1, obj2, nodeName) =>
  _.find(changesTypeActions, ({ check }) => check(obj1, obj2, nodeName));

const genDiffToAst = (obj1, obj2) => {
  const keys = _.union(_.keys(obj1), _.keys(obj2));
  return keys.map((key) => {
    const { type, process } = getChangesTypeAction(obj1, obj2, key);
    const { from, to, children } = process(obj1[key], obj2[key], genDiffToAst);
    return {
      node: key, type, from, to, children,
    };
  });
};

export default (pathToFile1, pathToFile2, format) => {
  const fileContent1 = fs.readFileSync(pathToFile1, 'utf8');
  const fileContent2 = fs.readFileSync(pathToFile2, 'utf8');
  const fileExt1 = path.extname(pathToFile1);
  const fileExt2 = path.extname(pathToFile2);
  const ast = genDiffToAst(parse(fileContent1, fileExt1), parse(fileContent2, fileExt2));
  // return JSON.stringify(ast);
  const renderer = getRenderer(format);
  return renderer.toString(ast);
};
