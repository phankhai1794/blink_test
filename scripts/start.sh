#!/bin/bash
# @description: Start the node server or build in the first time

if [ ! -d "dist" ]; then
    echo Build Portal static distribution
    ./scripts/build.sh
fi

node index.js
