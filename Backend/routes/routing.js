const express = require("express");
const router = express.Router();
const RoutingData = require("../models/RoutingData");
const { exec } = require("child_process");

router.post("/routing-data", (req, res) => {
  exec("netstat -rn | awk '{if (NR > 2) print $1 \",\" $3 \",\" $2}'", (error, stdout, stderr) => {
    if (error) {
      res.status(500).json({ message: error.message });
      return;
    }

    const lines = stdout.trim().split("\n");

    const routingDataList = lines.map(line => {
      const [networkdestination, netmask, gate] = line.split(",");
      return { networkdestination, netmask, gate };
    });

    RoutingData.insertMany(routingDataList)
      .then(savedRoutingData => {
        res.status(201).json({message: savedRoutingData});
      })
      .catch(err => {
        res.status(500).json({ message: err.message });
      });
  });
});

module.exports = router;
