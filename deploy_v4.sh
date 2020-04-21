#!/bin/bash

git diff-tree --name-only -r HEAD~1 | grep v4 && do_deploy=1

if [ -n "$do_deploy" ]; then
    npm install -g firebase-tools
    cd $TRAVIS_BUILD_DIR/v4
    echo "Deploying to only hosting:$DEPLOY_TARGET" 
    npm install
    npm run build
    firebase deploy --project index-of-knowledge --only hosting:$DEPLOY_TARGET --token $FIREBASE_TOKEN
else
    echo "No changes, skipping deploy!"
fi