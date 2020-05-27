#!/bin/bash

export SCRAPE_LINK="https://ipfs.io/ipfs/QmfA4hp3ue2JS2BR2hG18rWgVCWxDFaRYaGV4GQm4WsrdT"

# log the python version
python --version

# install 3.7 manually
yes | sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt-get update
sudo apt-get install python3.7
sudo apt-get install python3-pip

cd $TRAVIS_BUILD_DIR/scraper 

python3.7 -m pip install -r requirements.txt 

python3 scrape.py --link $SCRAPE_LINK --out ../README.md
