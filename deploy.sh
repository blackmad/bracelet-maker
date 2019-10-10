#!/bin/sh
cd static
s3cmd sync --exclude '*node_modules*' . s3://gen1-alpha.blackmade.co/
cd ..
s3cmd sync --exclude '*node_modules*' dist/ s3://gen1-alpha.blackmade.co/dist/
