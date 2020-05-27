#!/bin/bash

export SCRAPE_LINK="https://ipfs.io/ipfs/QmfA4hp3ue2JS2BR2hG18rWgVCWxDFaRYaGV4GQm4WsrdT"

./build.sh

pipenv run python3 -m scraper --link $SCRAPE_LINK --out ../README.md
