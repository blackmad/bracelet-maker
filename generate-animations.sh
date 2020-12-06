#!/bin/sh
rm -rf animation-scratch/*
npx tsc -p tsconfig-node.json
node -r esm generate-animation.js
# find . -name "*.png" -exec convert "{}" -background white -alpha remove -alpha off "{}" \;

# cd animation-scratch/
# find . -name "*.svg" -exec svg2png -w 600 -o "{}".png "{}" \;
# find . -name "*.png" -exec convert "{}" -background white -flatten   -trim   "{}" \;
# convert -size 600x600 -delay 100  -loop 0 *png ../out.gif; chrome ../out.gif
