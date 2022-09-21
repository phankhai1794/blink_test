#!/bin/bash
# @description: Build process within Docker

yarn install

yarn build

BASEDIR=$(dirname "$0")

rm -rf dist
mv build dist

echo "Build deployed to dist folder"
