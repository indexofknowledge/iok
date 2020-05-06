# Funcs

Some cloud functions to proxy store and retrieve methods for IPFS via Pinata pinning.

To deploy, you can set env variables in `.env.yaml`:

```
PINATA_API_KEY: <api key>
PINATA_SECRET_KEY: <super secret key>
```

A simple sanity e2e test is provided in `test_store_retrieve.sh`, which stores the `test.json` using our deployed cloud function and tries to retrieve it using an IPFS gateway. This test depends on the liveness of Pinata pinning service, so it might time out.