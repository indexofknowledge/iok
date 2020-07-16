#!/usr/bin/env python

import argparse
import traceback
from .validate import run_validator

parser = argparse.ArgumentParser()
parser.add_argument("--file", required=True, type=str, help="Path to IoK JSON graph file")
parser.add_argument("--debug", action="store_true")
args = parser.parse_args()

try:
    run_validator(file=args.file, debug=args.debug)
    print("😊 validation successful")
except AssertionError:
    track = traceback.format_exc()
    print(track)
    print("😞 validation failed")
except Exception:
    track = traceback.format_exc()
    print(track)
    print("😨 Something horrible happened")

