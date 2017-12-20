import _ from 'lodash';

export const eol = '\n';

const genPrettyReport = (ast, level = 0) => {
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
    nested: n => `${getSpace(level)}   ${n.node}: ${genPrettyReport(n.children, level + 1)}`,
  };

  const res = ast.map(n => mappingNodeToString[n.type](n));
  return _.flatten(['{', ...res, `${getSpace(level)}}`]).join(eol);
};

const genPlainReport = (ast, parents = []) => {
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
    const mappingNodeToString = {
      changed: () => `Property '${propName}' was updated. From '${n.from}' to '${n.to}'`,
      removed: () => `Property '${propName}' was removed`,
      added: () => `Property '${propName}' was added with ${to}`,
      unchanged: () => '',
      nested: () => genPlainReport(n.children, [...parents, n.node]),
    };
    return [...acc, mappingNodeToString[n.type]()];
  }, []);

  return res.join(eol);
};

const genJsonReport = ast => JSON.stringify(ast);

const mappingReport = {
  json: genJsonReport,
  plain: genPlainReport,
  pretty: genPrettyReport,
};

export default (ast, format = 'pretty') => mappingReport[format](ast);
