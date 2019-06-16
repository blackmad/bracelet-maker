# bracelet-maker

## build
npx webpack
--> https Live Server from vscode

## release to prod
s3cmd sync --exclude '*node_modules*' . s3://gen1-alpha.blackmade.co/
