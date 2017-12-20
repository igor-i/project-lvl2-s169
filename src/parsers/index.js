import yaml from 'js-yaml';
import ini from 'ini';

const mappingParse = {
  '.json': JSON.parse,
  '.yaml': yaml.safeLoad,
  '.ini': ini.parse,
};

export default (fileContent, fileExt) => mappingParse[fileExt](fileContent);
