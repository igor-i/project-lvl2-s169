#!/usr/bin/env node

import commander from 'commander';
import genDiff from '..';

commander
  .version('1.0.0')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', 'Output format[type]', 'pretty')
  .action((firstConfig, secondConfig, option) => {
    console.log(genDiff(firstConfig, secondConfig, option.format));
  })
  .parse(process.argv);
