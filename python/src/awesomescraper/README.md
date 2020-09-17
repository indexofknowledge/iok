# awesomescraper

This directory contains a few things:
1. A script that scrapes an [awesomelist of awesomelists](https://github.com/sindresorhus/awesome), then saves each as a markdown file locally in [awesomes](./awesomes)
2. Naive conversion of those awesomelists to iok graph format using our own `mdscraper`, which can be located in [awesomes_iok](./awesomes_iok)
3. Manually cleaned awesomelists in [clean_awesomes](./clean_awesomes)

## MD cleaning procedure

1. Find an awesomelist in `awesomes`
2. Copy it over to `clean_awesomes`
3. Clean it up manually into a format that is more easily understandable to `mdscraper`. This tends to be using more headers, and no fancy symbols.
4. Run the `mdscraper` on it
   ```
   # from the project root dir, use the utils wrapper
   $ ./utils/iok.sh mdscrape \
            python/src/awesomescraper/clean_awesomes/[name of awesome].md \
            temp.json
   ```
5. For now, `mdscraper` is not up-to-date with the new CID spec, so we can format it to what we want
    ```
    cat temp.json | ./utils/iok.sh format_graph > formatted_temp.json
    ```
6. As a sanity check, then validate the graph format
    ```
    ./utils/iok.sh validate_graph formatted_temp.json
    ```
7. Upload to IPFS too, and validate the CID using the web client: e.g. run `v4` and visit `localhost:3000/ipfs?hash=[CID]`
   ```
   cat formatted_temp.json | ./utils/iok.sh put_graph
   ```
8. If it's good, then feel free to move it to the `clean_awesomes` directory
   ```
   mv formatted_temp.json python/src/awesomescraper/clean_awesomes/[name of awesome].json
   ```

## IoK list

This list might come in handy when we're compiling a list of IoKs to feature on our webapp deployment. Maintain it as a CSV so we can extract it easily later on.

```
name,cid
awesome-audio-visualization-willianjusten,bafyreiclcwvhztauvmhaya5lzv2jj32cdxbz6rioosarpc4ffciagchemi
awesome-coq-coq-community,bafyreia23vsvjmewtrxh3ugk2heqyclxtcy3p4iy7bkeoty66kfhl4n42e
awesome-agriculture-beaorn,bafyreifvngplta5xyfppzonm3ug4ejsyi5tjwqp3ydr75hkybgqjj2sbr4
awesome-jquery-petk,bafyreid7fx65nqzfy3yas4mgbbcaev32sf5y2uxtjogs4lgubyvbh2rede
```

### TODO (bugs)

* Scrape fails for MD links with no text following. e.g. `^\[.*\]\(.*\)$`
* There's something wrong with awesome-c (in clean_awesomes) that prevents it from working with `./utils/iok.sh` tools. Perhaps some weird escape character