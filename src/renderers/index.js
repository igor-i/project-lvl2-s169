import renderJson from './json';
import renderPlain from './plain';
import renderPretty from './pretty';

export const eol = '\n';

const mappingReport = {
  json: renderJson,
  plain: renderPlain,
  pretty: renderPretty,
};

export default format => mappingReport[format];
