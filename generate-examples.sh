#!/bin/sh

set +x

tsc
rm static/demo-output/*
node -r esm generate-examples-node.js
