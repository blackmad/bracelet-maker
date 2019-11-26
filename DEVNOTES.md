# bracelet-maker

## run locally
    npm run serve

hosted at:   http://localhost:8080/


## release to prod
    npm build
    s3cmd sync --exclude '*node_modules*' . s3://gen1-alpha.blackmade.co/
