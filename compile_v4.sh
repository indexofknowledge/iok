#!/bin/bash

cd $TRAVIS_BUILD_DIR/v4
npm install -g firebase-tools
npm install
npm run build
