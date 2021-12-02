#!/bin/bash
# @author DangTran
# @description: 
npm ci
npm run build
BASEDIR=$(dirname "$0")
echo "Build deployed to dist folder"
rm -rf dist
mv build dist
node index.js
