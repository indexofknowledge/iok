#!/usr/bin/env python3

FILENAME = 'dummy_book.md'

def read_from_file(filename=FILENAME):
    """Reads graph from JSON file in data link format"""
    with open(filename, 'r') as f:
        dat = f.read
