#!/bin/bash

#
# Various utilities
#

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

show_help() {
  echo "setup_node        Install node if it\'s not present and npm install the utils"
  echo "get_full_graph    Print full graph json from CID"
  echo "put_graph         Takes graph JSON from stdin and puts to IPFS"
  echo "obj_to_cid        Takes an object JSON from stdin and gets its CID"
}

setup_node() {
  if ! command -v node &> /dev/null; then
    curl -sL https://deb.nodesource.com/setup_13.x | sudo bash -
    sudo apt-get install -y nodejs
    node -v
  fi
  (cd $DIR && npm install)
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

obj_to_cid() {
  read -r obj
  if [ -z "$obj" ]; then
    echo "Obj not specified"
    exit 1
  fi
  export NODE_NO_WARNINGS=1
  export OBJ=$obj
  export FUNC=objToCid
  node --experimental-repl-await $DIR/ipfs_client.js
}


if declare -f "$1" >/dev/null 2>&1; then
  "$@"
else
  show_help
  exit 1
fi
