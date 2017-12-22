import _ from 'lodash';
import { eol } from './';

const renderPrettyReport = (ast, level = 0) => {
  const getSpace = lev => ' '.repeat(lev * 3);

  const objToString = (obj, lev) => {
    const str = _.keys(obj).map(key =>
      [
        `   ${key}: `,
        _.isObject(obj[key]) ? objToString(obj[key], `${lev + 1}`) : `${obj[key]}`,
      ].join(''));

    return (['{', ...str, '}']).join(`${eol}${getSpace(lev)}`);
  };

  const nodeToString = (prefix, nodeKey, nodeValue) => ([
    `${getSpace(level)}${prefix}${nodeKey}: `,
    _.isObject(nodeValue) ? `${objToString(nodeValue, level + 1)}` : nodeValue,
  ].join(''));

  const mappingNodeToString = {
    changed: n => [nodeToString(' + ', n.node, n.to), nodeToString(' - ', n.node, n.from)],
    removed: n => nodeToString(' - ', n.node, n.from),
    added: n => nodeToString(' + ', n.node, n.to),
    unchanged: n => `${getSpace(level)}   ${n.node}: ${n.to}`,
    nested: n => `${getSpace(level)}   ${n.node}: ${renderPrettyReport(n.children, level + 1)}`,
  };

  const res = ast.map(n => mappingNodeToString[n.type](n));
  return _.flatten(['{', ...res, `${getSpace(level)}}`]).join(eol);
};

export default { toString: renderPrettyReport };
