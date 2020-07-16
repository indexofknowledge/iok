#!/bin/bash

#
# Various utilities
#

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJ_DIR="$( cd "$( dirname "$DIR" )" >/dev/null 2>&1 && pwd )"

show_help() {
  echo "setup_node        Install node if it\'s not present and npm install the utils"
  echo "setup_py          Install pipenv if it\'s not present and build the pipenv"
  echo "get_full_graph    Print full graph json from CID"
  echo "put_graph         Takes graph JSON from stdin and puts to IPFS"
}

setup_node() {
  if ! command -v node &> /dev/null; then
    curl -sL https://deb.nodesource.com/setup_13.x | sudo bash -
    sudo apt-get install -y nodejs
    node -v
  fi
  (cd $DIR && npm install)
}

setup_py() {
  if ! command -v pipenv &> /dev/null; then
    python3 -m pip install --upgrade pipenv
  fi
  (cd $PROJ_DIR/python && ./build.sh)
}

validate_graph() {
  graph_file=$1
  if [ -z $graph_file ]; then
    echo "Graph file not specified"
    exit 1
  elif [ ! -s $graph_file ]; then
    echo "Graph file missing or empty"
    exit 1
  fi
  (cd $PROJ_DIR/python && pipenv run python3 -m validator --file $PROJ_DIR/$graph_file)
}

get_full_graph() {
  cid=$1
  if [ -z "$cid" ]; then
    echo "CID not specified"
    exit 1
  fi
  export NODE_NO_WARNINGS=1
  export CID=$cid
  export FUNC=getFullGraph
  node --experimental-repl-await $DIR/ipfs_client.js
}

put_graph() {
  read -r graph
  if [ -z "$graph" ]; then
    echo "Graph not specified"
    exit 1
  fi
  export NODE_NO_WARNINGS=1
  export GRAPH=$graph
  export FUNC=putGraph
  node --experimental-repl-await $DIR/ipfs_client.js
}


if declare -f "$1" >/dev/null 2>&1; then
  "$@"
else
  show_help
  exit 1
fi
