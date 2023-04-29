const mongoose = require("mongoose");

// Network Schema
const NetworkSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        require: true
    },
    description: {
        type: String
    }
  },
  { collection: "Networks" }
);

module.exports = mongoose.model("Network", NetworkSchema);