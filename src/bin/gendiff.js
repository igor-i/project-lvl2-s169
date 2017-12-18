#!/usr/bin/env node

import commander from 'commander';

commander
  .version('0.0.4')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', 'Output format[type]', 'type')
  .parse(process.argv);
