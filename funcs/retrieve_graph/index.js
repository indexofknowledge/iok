const fetch = require("node-fetch");

const base = "https://ipfs.io/ipfs/";

/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 */
exports.retrieveGraph = (req, res) => {
  if (!("hash" in req.query)) {
    res.sen("ERROR: Invalid hash");
  }
  const settings = { method: "Get" };

  const url = base + req.query.hash;

  fetch(url, settings)
    .then((res) => res.json())
    .then((json) => {
      res.send(json);
    })
    .catch((err) => res.send("ERROR: Could not fetch"));
};
