const mongoose = require("mongoose");

// InputRule Schema : id, order, name, act, protoc, FL, to, cond, desc, pol, disabled]
/*
    id : 0,
    order : '1',
    name : 'Rule 1',
    act : 'Deny',
    protoc : ["SSH", "Telnet Server", "Telnet"],
    FL : ['External', 'Internal'],
    to : ['Internal'],
    cond : 'All Users',
    desc : '',
    pol : 'Array',
    disabled: false,
*/

const InputRuleSchema = new mongoose.Schema(
  {
    order: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        unique : true,
        required: true,
    },
    act: {
        type: String,
        enum: ["Drop", "Accept"],
    },
    protoc: {
        type: Object,
    },
    FL: {
        type: Array,
    },
    to: {
        type: Array,
    },
    cond: {
        type: String,
    },
    desc: {
        type: String
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    ports: {
        type: Array,
    }
  },
  { collection: "InputRules" }
);

module.exports = mongoose.model("InputRule", InputRuleSchema);