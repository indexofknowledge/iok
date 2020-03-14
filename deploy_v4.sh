#!/bin/bash

npm install -g firebase-tools
cd $TRAVIS_BUILD_DIR/v4
echo "Deploying to only hosting:$DEPLOY_TARGET" 
firebase deploy --project index-of-knowledge --only hosting:$DEPLOY_TARGET --token $FIREBASE_TOKEN
