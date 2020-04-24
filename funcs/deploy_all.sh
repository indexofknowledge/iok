#!/bin/bash

pwd=$PWD
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd $DIR/store_graph
gcloud functions deploy storeGraph --runtime nodejs8 --trigger-http --allow-unauthenticated --env-vars-file ../.env.yaml


cd $pwd