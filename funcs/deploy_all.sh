#!/bin/bash

pwd=$PWD
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

###########
# Just deploy everything
###########

cd $DIR/retrieve_graph
gcloud functions deploy retrieveGraph --runtime nodejs8 --trigger-http --allow-unauthenticated --env-vars-file ../.env.yaml

cd $DIR/store_graph
gcloud functions deploy storeGraph --runtime nodejs8 --trigger-http --allow-unauthenticated --env-vars-file ../.env.yaml

cd $DIR/test_auth
gcloud functions deploy helloHttp --runtime nodejs8 --trigger-http --allow-unauthenticated --env-vars-file ../.env.yaml


cd $pwd