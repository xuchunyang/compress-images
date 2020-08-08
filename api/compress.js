const https = require("https");

const apiUrl = "https://api.tinify.com/shrink";
const apiKey = "5l0PWMc7ZHadFIJR2X8vjp1Z1UWXRBE2";

module.exports = (req, res) => {
  // does this api work with cors? TODO test
  // res.setHeader("Access-Control-Allow-Origin", "*");
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
