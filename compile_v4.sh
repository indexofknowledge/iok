#!/bin/bash

git diff-tree --name-only -r HEAD~1 | grep v4 && do_compile=1

if [ -n "$do_compile" ]; then
    cd $TRAVIS_BUILD_DIR/v4
    npm install
    npm run lint && npm run build
else
    echo "No changes, skipping build!"
fi