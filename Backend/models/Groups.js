const mongoose = require("mongoose");

// Group Schema
const GroupSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        require: true
    },
    rules: {
        type: Array
    }
  },
  { collection: "Groups" }
);

module.exports = mongoose.model("Group", GroupSchema);