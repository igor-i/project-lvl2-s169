install:
	npm install

build:
	npm run build

test:
	npm test

start:
	npm run babel-node -- src/bin/gendiff.js __tests__/__fixtures__/before-tree.json __tests__/__fixtures__/after-tree.json -f 'pretty'

publish:
	npm publish

lint:
	npm run eslint .
