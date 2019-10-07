#!/usr/bin/env python3

import json
import random
import string
import networkx as nx
import matplotlib.pyplot as plt
from networkx.readwrite import json_graph
from enum import IntEnum
from logger import logger 

####################################  HELPER #################################### 

def random_string(string_length):
    """Generate a random string with the combination of lowercase and uppercase letters """
    letters = string.ascii_letters
    return ''.join(random.choice(letters) for i in range(string_length))


####################################  CONFIG #################################### 

FILENAME = 'graph.json'
AWESOME_FILE = 'awesome-blockchain.md'
IMG_FILE = 'iok.png'

####################################  CLASSES #################################### 
