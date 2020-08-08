const https = require("https");

const apiUrl = "https://api.tinify.com/shrink";
const apiKey = "5l0PWMc7ZHadFIJR2X8vjp1Z1UWXRBE2";

module.exports = (req, res) => {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    // not sure about these two headers
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.end();
    return;
  }
  
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  
  if (req.method !== "POST") {
    res.statusCode = 400;
    res.end(JSON.stringify({"error": "Support POST only"}, null, 4));
  }

  let body = [];
  req.on("data", chunk => body.push(chunk));
  req.on("end", () => {
    body = Buffer.concat(body);

    const tinifyReq = https.request(apiUrl, {method: "POST", auth: "api:"+apiKey}, tinifyRes => {
      res.statusCode = tinifyRes.statusCode;

      // console.log(tinifyRes.headers);
      if (tinifyRes.headers.location)
        res.setHeader("location", tinifyRes.headers.location);

      let tinifyBody = [];
      tinifyRes.on("data", chunk => tinifyBody.push(chunk));
      tinifyRes.on("end", () => {
        tinifyBody = Buffer.concat(tinifyBody).toString();
        const json = JSON.parse(tinifyBody);
        res.end(JSON.stringify(json, null, 4));
      });
    });
    tinifyReq.end(body);
  });
};
