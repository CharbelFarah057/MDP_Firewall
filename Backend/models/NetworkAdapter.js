const mongoose = require("mongoose");

const networkAdapterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ["Static", "Dynamic"]
  },
  ip: {
    type: String,
    required: true
  },
  subnet: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ["Connected", "Disconnected"]
  },
  disabled: {
    type: Boolean,
    required: true
  }
},
{ collection: "NetworkAdapters" }
);

const NetworkAdapter = mongoose.model("NetworkAdapter", networkAdapterSchema);

module.exports = NetworkAdapter;
