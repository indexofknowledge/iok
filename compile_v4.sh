#!/bin/bash

cd $TRAVIS_BUILD_DIR/v4
npm install
npm run lint && npm run build
