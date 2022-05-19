#!/usr/bin/env bash

echo "Running envsub on env.template.js to env.js"
envsub src/env.template.js dist/blocksplit-dapp-workshop/env.js

rm dist/blocksplit-dapp-workshop/ngsw.json
ngsw-config dist/blocksplit-dapp-workshop ngsw-config.json
