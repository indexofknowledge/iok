#!/bin/bash -xv

pipenv install --dev
pipenv run python3 setup.py develop
