const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_KEY);

/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 */
exports.storeGraph = (req, res) => {
    if (!('elements' in req.body)) {
        res.send("ERROR: Invalid graph");
    }
    body = {"elements": req.body.elements};
    pinata.pinJSONToIPFS(body).then((result) => {
        res.send(result);
    }).catch((err) => {
        res.send("ERROR: Could not pin");
    })
};