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
  echo "obj_to_cid        Takes an object JSON from stdin and gets its CID"
  echo "format_graph      Takes a graph JSON from stdin and returns it correctly formatted to spec"
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

# utility to scrape locally
mdscrape() {
  path=$1
  out=$2

  if [ -z $path ] || [ -z $out ]; then
    echo "Missing path. Usage: ./iok.sh [src_path] [dst_path]"
    exit 1
  fi
  PIPENV_PIPFILE=$PROJ_DIR/python/Pipfile pipenv run python3 -m mdscraper \
      --path $path --out $out
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

get_graph() {
  cid=$1
  if [ -z "$cid" ]; then
    echo "CID not specified"
    exit 1
  fi
  export CID=$cid
  export FUNC=getGraph
  node --experimental-repl-await $DIR/ipfs_client.js
}

put_graph() {
  read -r graph
  if [ -z "$graph" ]; then
    echo "Graph not specified"
    exit 1
  fi
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
  export OBJ=$obj
  export FUNC=objToCid
  node --experimental-repl-await $DIR/ipfs_client.js
}

format_graph() {
  read -r graph
  if [ -z "$graph" ]; then
    echo "Graph not specified"
    exit 1
  fi
  export GRAPH=$graph
  export FUNC=formatGraph
  node --experimental-repl-await $DIR/ipfs_client.js
}


if declare -f "$1" >/dev/null 2>&1; then
  "$@"
else
  show_help
  exit 1
fi
