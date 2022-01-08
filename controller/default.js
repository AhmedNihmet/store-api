const debug = require("debug");
const fs = require("fs");

module.exports = (query) => [
  (req, res) => {
    try {
      query(req)
        .then((data) => {
          if (data) {
            res.json(data);
          } else if (req.method === "DELETE" || req.method === "POST") {
            res.status(200).send("");
          } else {
            res.status(404).json({ msg: "resource or body not found" });
          }
        })
        .catch((e) => {
          res.status(500).json({ msg: e.toString() });
          debug.log(e);

        });
    } catch (e) {
      console.log(e);
      res.status(500).json({ msg: "server error occurred 2" });
      const env = process.env.LUNCH_ENV || "development";
    }
  },
];
