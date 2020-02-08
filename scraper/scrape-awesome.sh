#!/bin/bash
#
# Simple script to scrape the given blockstack app URL, fully render, grab the json, and linearize it
#

case "$DEPLOY_TARGET" in
    prod) export SCRAPE_APP='https://index-of-knowledge.firebaseapp.com/?loaduser=rustielin.id.blockstack&guest=true'
    beta) export SCRAPE_APP='https://index-of-knowledge-beta.firebaseapp.com/?loaduser=rustielin.id.blockstack&guest=true'
    *) exit ;;
esac

export GRAPH_FILE='graph.json'
export TEMP='.temp'
# careful not to overwrite this dir's README...
export AWESOME_FILE='../README.md'
export IMG_FILE='iok.png'

log() {
    if [[ $verbose -eq 1 ]]; then
        echo "$@"
    fi
}

print_usage() {
  echo "usage: scrape-awesome [vh] [-f graphfile]"
  echo "    -v      verbose"
  echo "    -f      graph file instead of scraping"
  echo "    -h      print help"
  exit
}

file=''
verbose=0

while getopts 'fvh' flag; do
    case "${flag}" in 
        f) file="${OPTARG}" ;;
        v) verbose=1 ;;
        h) print_usage ;;
    esac
done

if [[ -z $file ]] 
then 
    log "running scrapper"
    node scrape.js
else
    log "using file" $file
fi

if [ $? -eq 0 ]
then
    log "------ scrape successful ------"    
    log "make graph prettier"
    python3.7 -m json.tool $GRAPH_FILE > $GRAPH_FILE$TEMP

    mv $GRAPH_FILE$TEMP $GRAPH_FILE

    log "got graph data, sample: "
    head $GRAPH_FILE

    echo "generating awesome-list"
    python3.7 iok_client.py

    log "got awesome-list, sample: "
    head $AWESOME_FILE
else
    log "!!!!!! scrape failed !!!!!!"
    echo "exiting..."
fi