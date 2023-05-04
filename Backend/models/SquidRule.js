const mongoose = require("mongoose");

const SquidRuleschema = new mongoose.Schema({
    name :{
        type: String,
        required: true,
        unique: true
    },
    domains :{
        type: Array,
        required: true
  },
},
  { collection: "SquidRules" }
);

module.exports = mongoose.model("SquidRule", SquidRuleschema);