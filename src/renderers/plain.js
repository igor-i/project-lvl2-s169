import { eol } from './';

const mappingValue = {
  undefined: value => `value: ${value}`,
  boolean: value => `value: ${value}`,
  number: value => `value: ${value}`,
  string: value => `'${value}'`,
  object: () => 'complex value',
};

const renderPlainReport = (ast, parents = []) => {
  const res = ast.reduce((acc, n) => {
    const to = mappingValue[typeof n.to](n.to);
    const propName = [...parents, n.node].join('.');
    const mappingNodeToString = {
      changed: () => `Property '${propName}' was updated. From '${n.from}' to '${n.to}'`,
      removed: () => `Property '${propName}' was removed`,
      added: () => `Property '${propName}' was added with ${to}`,
      unchanged: () => '',
      nested: () => renderPlainReport(n.children, [...parents, n.node]),
    };
    return [...acc, mappingNodeToString[n.type]()];
  }, []);

  return res.join(eol);
};

export default { toString: renderPlainReport };
