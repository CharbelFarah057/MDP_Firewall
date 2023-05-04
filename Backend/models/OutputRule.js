const mongoose = require("mongoose");

// OutputRule Schema : id, order, name, act, protoc, FL, to, cond, desc, pol, disabled]
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

const OutputRuleSchema = new mongoose.Schema(
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
    action: {
        type: String,
        enum: ["Drop", "Accept"],
    },
    tcp_protocol: {
        type: Object,
    },
    udp_protocol: {
        type: Object,
    },
    source_network: {
        type: Array,
    },
    destination_network: {
        type: Array,
    },
    condition: {
        type: String,
        default: "All Users"
    },
    description: {
        type: String,
        default: ""
    },
    ports: {
        type: Object,
    }
  },
  { collection: "OutputRules" }
);

module.exports = mongoose.model("OutputRule", OutputRuleSchema);