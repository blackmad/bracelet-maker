# bracelet-maker

## run locally
npm serve


## release to prod
npm build
s3cmd sync --exclude '*node_modules*' . s3://gen1-alpha.blackmade.co/
