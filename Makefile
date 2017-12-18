install:
	npm install

build:
	npm run build

start:
	npm run babel-node -- src/bin/gen-diff.js

publish:
	npm publish

lint:
	npm run eslint .
