#!/bin/bash -xv

set -euo pipefail

pipenv run python3 setup.py pytest --addopts="src $@"
pipenv run black --check src
