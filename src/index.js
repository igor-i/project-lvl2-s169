import fs from 'fs';

const eol = '\n';

const uploadFile = pathToFile =>
  JSON.parse(fs.readFileSync(pathToFile, 'utf8'));

const compare = (obj1, obj2) => {
  const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
  return Array.from(keys).reduce((acc, key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];
    const astNode = { node: [key] };
    if (key in obj1 && key in obj2) {
      astNode.type = value1 === value2 ? 'unchanged' : 'changed';
      astNode.from = value1;
      astNode.to = value2;
    } else if (key in obj1) {
      astNode.type = 'removed';
      astNode.from = value1;
      astNode.to = undefined;
    } else {
      astNode.type = 'added';
      astNode.from = undefined;
      astNode.to = value2;
    }

    return [...acc, astNode];
  }, []);
};

const outputReport = (ast) => {
  const resultStrings = ast.map((node) => {
    switch (node.type) {
      case 'changed':
        return [` + ${node.node}: ${node.to}`, ` - ${node.node}: ${node.from}`].join(eol);
      case 'removed':
        return ` - ${node.node}: ${node.from}`;
      case 'added':
        return ` + ${node.node}: ${node.to}`;
      default:
        return `   ${node.node}: ${node.to}`; // unchanged
    }
  });

  return ['{', ...resultStrings, '}'].join(eol);
};

export default (pathToFile1, pathToFile2) => {
  const file1 = uploadFile(pathToFile1);
  const file2 = uploadFile(pathToFile2);
  return outputReport(compare(file1, file2));
};
