import sys
import json
from .md_scrape import graphFromText, main

# configs
JSON_FILE = "graph.json"
GRAPH_FILE = "graph.png"

if len(sys.argv) < 2:
    print("Missing link argument")
    print("Expected: md_scrape <raw md link>")
    print(
        "Example: md_scrape https://raw.githubusercontent.com/rustielin/iok/master/README.md"
    )
    exit(1)

if (str(sys.argv[1])[0]=='-'):
    print(json.dumps(graphFromText(sys.stdin.read()).write_to_json()))
else:
    link = sys.argv[1]
    g = main(link)

    # draw to file for debugging
    g.write_graph(GRAPH_FILE)
    g.write_to_json(JSON_FILE)
