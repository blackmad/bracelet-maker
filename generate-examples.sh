#!/bin/sh

set +x

tsc -p tsconfig-node.json
rm public/demo-output/*
node -r esm generate-examples-node.js
