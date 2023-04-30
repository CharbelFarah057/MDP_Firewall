const mongoose = require("mongoose");

const routingDataSchema = new mongoose.Schema({
  networkdestination: {
    type: String,
    required: true
  },
  netmask: {
    type: String,
    required: true
  },
  gate: {
    type: String,
    required: true
  }
}, { collection: "Routing" }); // Specify the collection name

const RoutingData = mongoose.model("RoutingData", routingDataSchema);

module.exports = RoutingData;
