const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_KEY);

const cors = require('cors')

/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 */

exports.storeGraph = (req, res) => {
    cors_inst = cors();
    cors_inst(req, res, () => {
        storeGraph(req, res)
    })
}

const storeGraph = (req, res) => {
      console.log("PAYLOAD BODY", req.body);
      if (!req.body.hasOwnProperty('elements')) {
          res.send("ERROR: Invalid graph");
      }
      body = {"elements": req.body.elements};
      pinata.pinJSONToIPFS(body).then((result) => {
          res.send(result);
      }).catch((err) => {
          res.send("ERROR: Could not pin");
      })
};
