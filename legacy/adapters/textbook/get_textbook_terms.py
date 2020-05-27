#!/usr/bin/env python3

import re

regex = re.compile("[^a-zA-Z]")

FILENAME = "dummy_book.md"
KEY_TERMS_DELIM = "## key terms"
HEADER_DELIM = "##"
LIST_START = "*"
TERM_DESC_DELIM = ":"

with open(FILENAME, "r") as f:
    lines = f.readlines()

if not lines:
    raise Exception("Can't read file lines")

is_reading_terms = False
for line in lines:
    if line.lower().strip() == KEY_TERMS_DELIM:
        is_reading_terms = True
    elif HEADER_DELIM in line:  # if another header, else
        is_reading_terms = False

    # it's not a term space
    if not is_reading_terms:
        continue

    # it's not an UL
    if LIST_START not in line:
        continue

    sp = line.split(TERM_DESC_DELIM)
    sp[0] = sp[0].strip()
    sp[1] = sp[1].strip()
    term = regex.sub("", sp[0])
    desc = sp[1]
    print(f"Term: {term}")
    print(f"Desc: {desc}\n")
