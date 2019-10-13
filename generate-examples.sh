#!/bin/sh

set +x

tsc
node -r esm generate-examples-node.js
