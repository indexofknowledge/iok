#!/bin/bash

##########
# Some test curls
##########

test_hash=$(curl -s -X POST -H "Content-Type: application/json" -d @test.json https://us-central1-index-of-knowledge.cloudfunctions.net/storeGraph | python -c "import sys,json; print(json.load(sys.stdin)['IpfsHash'])")

echo "Pinned with hash $test_hash"
echo "Trying to fetch now..."
echo 

curl -s https://ipfs.io/ipfs/$test_hash | grep nodes

echo

if [ $? -eq 0 ]
then
    echo "TEST PASS!!!"
else
    echo "TEST FAILED..."
fi