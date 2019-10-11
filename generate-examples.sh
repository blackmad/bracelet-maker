#!/bin/sh

set +x

tsc
node --experimental-modules generate-examples-node.js
