const mongoose = require("mongoose");

const networkRuleSchema = new mongoose.Schema({
  order: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  relation: {
    type: String,
    required: true,
    enum: ["Route", "NAT"]
  },
  srcnetworks: {
    type: [String],
    required: true
  },
  dstnetworks: {
    type: [String],
    required: true
  },
  nataddress: {
    type: String
  },
  desc: {
    type: String
  },
  disabled: {
    type: Boolean,
    required: true
  }
}, { collection: "NetworkRules" }); 

const NetworkRule = mongoose.model("NetworkRule", networkRuleSchema);

module.exports = NetworkRule;
