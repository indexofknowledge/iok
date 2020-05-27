#!/usr/bin/env python3

import hashlib
import json
import random
import string
import networkx as nx
import matplotlib.pyplot as plt
from networkx.readwrite import json_graph
from enum import IntEnum

####################################  HELPER ####################################


def random_string(string_length):
    """Generate a random string with the combination of lowercase and uppercase letters """
    letters = string.ascii_letters
    return "".join(random.choice(letters) for i in range(string_length))


def encrypt_string(hash_string):
    """TODO: enable encrypt node before push"""
    sha_signature = hashlib.sha256(hash_string.encode()).hexdigest()
    return sha_signature


####################################  CONFIG ####################################


FILENAME = "static/graph.json"
AWESOME_FILE = "README.md"
IMG_FILE = "static/iok.png"

####################################  CLASSES ####################################
