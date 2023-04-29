const mongoose = require("mongoose");

// Rule Schema : id, order, name, act, protoc, FL, to, cond, desc, pol, disabled]
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

const RuleSchema = new mongoose.Schema(
  {
    order: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    act: {
        type: String,
        enum: ["Deny", "Allow"],
    },
    protoc: {
        type: Array,
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
    pol: {
        type: String,
    },
    disabled: {
        type: Boolean,
        default: false,
    }
  },
  { collection: "Rules" }
);

module.exports = mongoose.model("Rule", RuleSchema);