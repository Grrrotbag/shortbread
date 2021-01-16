require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const dns = require("dns");
const sha1 = require("sha1");
const URL = require("url").URL;
const bodyParser = require("body-parser");

// =============================================================================
// Configuration
// =============================================================================
const port = process.env.PORT || 3000;
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log("Database connection status: ", mongoose.connection.readyState);
});
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// =============================================================================
// DATABASE
// =============================================================================
const { Schema } = mongoose;

const shortUrlSchema = new Schema({
  original_url: { type: String, required: true },
  short_url: { type: String, unique: true },
});

let ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);
// =============================================================================
// SERVER
// =============================================================================
app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/shorturl/new", (req, res) => {
  let requestedUrl = req.body.url;
  let urlObject = new URL(requestedUrl);

  dns.lookup(urlObject.hostname, (err, address, family) => {
    if (err) {
      res.json({
        error: "invalid URL",
      });
    } else {
      let hash = sha1(urlObject.toString()).slice(0, 7);

      let data = new ShortUrl({
        original_url: requestedUrl,
        short_url: hash,
      });

      data.save((err, data) => {
        if (err) return console.error(err);
      });

      res.json({
        original_url: requestedUrl,
        short_url: hash,
      });
    }
  });
});

app.get("/api/shorturl/:num", (req, res) => {
  let requestedId = req.params.num;

  ShortUrl.findOne({ short_url: requestedId }, (err, doc) => {
    if (doc) {
      res.redirect(doc.original_url);
    } else {
      res.json({
        error: "No short URL found for the given input",
      });
    }
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
