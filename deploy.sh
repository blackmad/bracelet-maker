#!/bin/sh
yarn build
s3cmd -c ~/.s3cfg-personal sync --exclude '*node_modules*' dist/*  s3://gen1-alpha.blackmade.co/
# cd ..
# s3cmd sync --exclude '*node_modules*' dist/ s3://gen1-alpha.blackmade.co/dist/
