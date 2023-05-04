var express = require("express");
var router = express.Router();

const { getToken, COOKIE_OPTIONS, getRefreshToken, verifyUser } = require("../authenticate")
const { exec } = require("child_process");

const User = require("../models/User.js");

let InputRule = require("../models/InputRule");
let OutputRule = require("../models/OutputRule");
let ForwardRule = require("../models/ForwardRule");
const { ObjectID } = require("bson");


function getSourceNetworks(user, sourceNames) {
    const sourceNetworks = [];

    sourceNames.forEach(name => {
        if (name === "Internal") {
            user.internalNetworks.forEach(network => {
                sourceNetworks.push(`${network.ip}/${network.subnetMask}`);
            });
        }
        if (name === "External") {
            user.externalNetworks.forEach(network => {
                sourceNetworks.push(`${network.ip}/${network.subnetMask}`);
            });
        }
        if (name === "Local Host") {
            sourceNetworks.push("127.0.0.1");
        }
    });

    return sourceNetworks;
}

function getDestinationNetworks(user, destinationNames) {
    const destinationNetworks = [];

    destinationNames.forEach(name => {
        if (name === "Internal") {
            user.internalNetworks.forEach(network => {
                destinationNetworks.push(`${network.ip}/${network.subnetMask}`);
            });
        }
        if (name === "External") {
            user.externalNetworks.forEach(network => {
                destinationNetworks.push(`${network.ip}/${network.subnetMask}`);
            });
        }
        if (name === "Local Host") {
            destinationNetworks.push("127.0.0.1");
        }
    });

    return destinationNetworks;
}


 async function executeIptablesCommand(rule_name, chain, source, destination, tcp_protocol, udp_protocol, ports, action, description, count) {
    let commands_to_run = [];
    let rule_sets = [];

    const dports_tcp = tcp_protocol.selectedProtocols;
    const dports_udp = udp_protocol.selectedProtocols;
    
    const all_outbound_tcp = tcp_protocol.allOutbound || [];
    const all_outbound_except_tcp = tcp_protocol.allOutboundExcept || [];

    const all_outbound_udp = udp_protocol.allOutbound || [];
    const all_outbound_except_udp = udp_protocol.allOutboundExcept || [];

    const sports_lsp = ports.limitedSourcePort || [];
    const sports_asp = ports.anySourcePort || [];


    if (dports_tcp.length > 0){
        const command_tcp = `sudo iptables -I ${chain} -s ${source} -d ${destination} -p tcp -m multiport --dport ${dports_tcp.join(",")} -j ${action.toUpperCase()}`
        commands_to_run.push(command_tcp)
        let rule_set = {
            order: 1,
            action: action,
            tcp_protocol: tcp_protocol,
            udp_protocol: udp_protocol,
            source_network: source,
            destination_network: destination,
            condition: "All Users",
            description: description,
            ports: ports
        }
        rule_sets.push(rule_set)
        
    }
    if (dports_udp.length > 0){
        const command_udp = `sudo iptables -I ${chain} -s ${source} -d ${destination} -p udp -m multiport --dport ${dports_udp.join(",")} -j ${action.toUpperCase()}`
        commands_to_run.push(command_udp)

        let rule_set = {
            order: 1,
            action: action,
            tcp_protocol: tcp_protocol,
            udp_protocol: udp_protocol,
            source_network: source,
            destination_network: destination,
            condition: "All Users",
            description: description,
            ports: ports
        }
        rule_sets.push(rule_set)
        
    }
    if (sports_lsp.length > 0){
        let lower_range = sports_lsp[0]
        let upper_range = sports_lsp[1]
        let sports_range = `${lower_range}:${upper_range}`

        if (lower_range === upper_range){
            sports_range = `${lower_range}`
        }
        let sports_protocol = sports_lsp[2]
        const command_lsp = `sudo iptables -I ${chain} -s ${source} -d ${destination} -p ${sports_protocol} --sport ${sports_range} -j ACCEPT`
        commands_to_run.push(command_lsp)

        let rule_set = {
            order: 1,
            action: action,
            tcp_protocol: tcp_protocol,
            udp_protocol: udp_protocol,
            source_network: source,
            destination_network: destination,
            condition: "All Users",
            description: description,
            ports: ports
        }
        rule_sets.push(rule_set)        
    }
    if (all_outbound_tcp.length > 0){
        const command_all_outbound_tcp = `sudo iptables -I ${chain} -s ${source} -d ${destination} -j ${action.toUpperCase()}`
        commands_to_run.push(command_all_outbound_tcp)
        let rule_set = {
            order: 1,
            action: action,
            tcp_protocol: tcp_protocol,
            udp_protocol: udp_protocol,
            source_network: source,
            destination_network: destination,
            condition: "All Users",
            description: description,
            ports: ports
        }
        rule_sets.push(rule_set)
    }
    if (all_outbound_except_tcp.length > 0){
        // put the reverse of action if ACCEPT => DROP and vice versa
        let reverse_action = action.toUpperCase() === "ACCEPT" ? "DROP" : "ACCEPT"
        const command_tcp = `sudo iptables -I ${chain} -s ${source} -d ${destination} -p tcp -m multiport --dport ${dports_tcp.join(",")} -j ${reverse_action}`
        commands_to_run.push(command_tcp)
        let rule_set = {
            order: 1,
            action: reverse_action,
            tcp_protocol: tcp_protocol,
            udp_protocol: udp_protocol,
            source_network: source,
            destination_network: destination,
            condition: "All Users",
            description: description,
            ports: ports
        }
        rule_sets.push(rule_set)
    }
    if (all_outbound_except_udp.length > 0){
        let reverse_action = action.toUpperCase() === "ACCEPT" ? "DROP" : "ACCEPT"
        const command_tcp = `sudo iptables -I ${chain} -s ${source} -d ${destination} -p udp -m multiport --dport ${dports_tcp.join(",")} -j ${reverse_action}`
        commands_to_run.push(command_tcp)
        let rule_set = {
            order: 1,
            action: reverse_action,
            tcp_protocol: tcp_protocol,
            udp_protocol: udp_protocol,
            source_network: source,
            destination_network: destination,
            condition: "All Users",
            description: description,
            ports: ports
        }
        rule_sets.push(rule_set)
    }       
        
         
    const createdRules = [];
    for (let i = 0; i < commands_to_run.length; i++) {
        console.log("Command to run: ", commands_to_run[i])
        try {
          await exec(commands_to_run[i]);
          console.log(`Command executed successfully: ${commands_to_run[i]}\n`);
        } catch (error) {
          console.error(`Error executing command: ${commands_to_run[i]}`);
        }
        let rule_type = chain.toUpperCase();
        let rule_set = rule_sets[i];
        count = count + 1;
        let modelName1 = `${rule_name}_${count}`;
        if (i == 0) {
            modelName1 = `${modelName1}_tcp`
        }
        else if (i == 1) {
            modelName1 = `${modelName1}_udp`
        }

        rule_set.name = modelName1;
        
        let response1 = await createRule(rule_set, rule_type, modelName1);
        //console.log(response1)
        if (response1.status) {
            throw new Error(response1.message);
        }
        
        createdRules.push(response1.json);
      }
    

    return createdRules;
}

async function createRule(rule_set, rule_type, modelName) {
    let Rule = null;
    rule_type = rule_type.toLowerCase()

    if (rule_type === "input") {
        Rule = InputRule;
    } else if (rule_type === "output") {
        Rule = OutputRule;
    } else if (rule_type === "forward") {
        Rule = ForwardRule;
    } else {
        return { status: 400, json: { message: "Invalid rule type" } };
    }

    let check_rule = await Rule.find({ name: modelName });
    if (check_rule.length > 0) {
        return { status: 400, json: { message: "Rule name already exists" } };
    }

    const rules = await Rule.find();
    for (let i = rules.length - 1; i >= 0; i--) {
        rules[i].order++;
        await rules[i].save();
    }

    const rule = new Rule(rule_set);

    const savedRule = await rule.save();

    return { json: savedRule };
}


// GET all rules from the database based on the rule type
router.get("/:rule_type", verifyUser, async (req, res) => {
    try {
        let rules = [];
        if (req.params.rule_type == "input") {
            rules = await InputRule.find({});
        } else if (req.params.rule_type == "output") {
            rules = await OutputRule.find({});
        } else if (req.params.rule_type == "forward") {
            rules = await ForwardRule.find({});
        } else {
            res.status(400).json({ message: "Invalid rule type" });
            return; 
        }
        // return rules in order based on the "order" field
        rules.sort((a, b) => (a.order > b.order) ? 1 : -1);
        res.json(rules);
    } catch (err) {
        res.json({ message: err });
    }
});

// GET a specific rule from the database check "order" field 
router.get("/:rule_type/:id", verifyUser, async (req, res) => {
    try {
        let rule = {};
        if (req.params.rule_type == "input") {
            rule = await InputRule.findOne({ order: req.params.id });
        } else if (req.params.rule_type == "output") {
            rule = await OutputRule.findOne({ order: req.params.id });
        } else if (req.params.rule_type == "forward") {
            rule = await ForwardRule.findOne({ order: req.params.id });
        } else {
            res.status(400).json({ message: "Invalid rule type" });
            return;
        }
        
        res.json(rule);
    } catch (err) {
        res.json({ message: err });
    }
});

// router.post("/add", verifyUser, async (req, res) => {
//     try {
//         // Rule is the database model for the rule type
//         let Rule = null;

//         if (req.body.rule_type == "input") {
//             Rule = InputRule;
//         } else if (req.body.rule_type == "output") {
//             Rule = OutputRule;
//         } else if (req.body.rule_type == "forward") {
//             Rule = ForwardRule;
//         } else {
//             res.status(400).json({ message: "Invalid rule type" });
//             return;
//         }

//         // make sure unique name is provided check if name already exist if so return error
//         let check_rule = await Rule.find({ name: req.body.name });
//         if (check_rule.length > 0) {
//             res.status(400).json({ message: "Rule name already exists" });
//             return;
//         }

//         const rules = await Rule.find();
//         for (let i = rules.length - 1; i >= 0; i--) {
//             rules[i].order++;
//             await rules[i].save();
//         }

//         const rule = new Rule({
//             order: 1,
//             name: req.body.name,
//             act: req.body.act,
//             protoc: req.body.protoc,
//             FL: req.body.FL,
//             to: req.body.to,
//             cond: req.body.cond,
//             desc: req.body.desc,
//             disabled: req.body.disabled,
//             ports: req.body.ports
//         });


//         const savedRule = await rule.save();

//         res.json(savedRule);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: err.message });
//     }
// });


router.post('/add', verifyUser, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const rule = req.body;
        const rule_type = rule.rule_type;
        let Rule = null;
        // check which rule type is being added
        if (rule_type === "input") {
            Rule = InputRule;
        } else if (rule_type === "output") {
            Rule = OutputRule;
        } else if (rule_type === "forward") {
            Rule = ForwardRule;
        } else {
            return { status: 400, json: { message: "Invalid rule type" } };
        }

        // make sure unique name is provided check if name already exist if so return error
        let check_rule = await Rule.find({ name: rule.name });
        if (check_rule.length > 0) {
            return { status: 400, json: { message: "Rule name already exists" } };
        }
        const modelName = rule.name;

        const chain = rule_type.toUpperCase();
        const sourceNetworks = getSourceNetworks(user, rule.source_network);
        const destinationNetworks = getDestinationNetworks(user, rule.destination_network);
        const tcp_protocol = rule.tcp_protocol;
        const udp_protocol = rule.udp_protocol;
        const action = rule.action;
        const ports = rule.ports;

        

        // const dports_tcp = tcp_protocol.selectedProtocols;
        // const dports_udp = udp_protocol.selectedProtocols;


        // const sports_lsp = rule.ports.limitedSourcePort; 
        // const sports_asp = rule.ports.anySourcePort;

        const description = rule.description;

        const createdRules = [];
        let count = 0;
        for (const source of sourceNetworks) {
            for (const destination of destinationNetworks) {
                try {
                    const executedRules = await executeIptablesCommand(modelName, chain, source, destination, tcp_protocol, udp_protocol, ports, action, description,count);
                    count = count + 1
                } catch (err) {
                    console.error(err);
                    res.status(500).json({ message: err.message });
                    return;
                }
            }
        }

        res.json(createdRules);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});



// delete rule
router.post("/delete", verifyUser, async (req, res) => {
    try {
        // Rule is the database model for the rule type
        let Rule = null;

        if (req.body.rule_type == "input") {
            Rule = InputRule;
        } else if (req.body.rule_type == "output") {
            Rule = OutputRule;
        } else if (req.body.rule_type == "forward") {
            Rule = ForwardRule;
        } else {
            res.status(400).json({ message: "Invalid rule type" });
            return;
        }
        
        const removedRule = await Rule.findOneAndDelete({ _id: req.body.id });
        
        if (!removedRule) {
            res.status(404).json({ message: "Rule not found" });
            return;
        }

        // execute iptables command to delete rule
        let rule_type = req.body.rule_type.toUpperCase();
        const command = `sudo iptables -D ${rule_type} ${removedRule.order}`;
        try {
            await exec(command); 
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Failed to delete rule from iptables." });
            return;
        }


        // update the order of the remaining rules
        const remainingRules = await Rule.find();

        for (let i = 0; i < remainingRules.length; i++) {
            if (remainingRules[i].order > removedRule.order) {
                remainingRules[i].order--;
                await remainingRules[i].save();
            }
        }        

        res.json(removedRule);
    } catch (err) {
        res.json({ message: err });
    }
});

// update rule
router.post("/edit", verifyUser, async (req, res) => {
    try {
        // Rule is the database model for the rule type
        let Rule = null;

        if (req.body.rule_type == "input") {
            Rule = InputRule;
        } else if (req.body.rule_type == "output") {
            Rule = OutputRule;
        } else if (req.body.rule_type == "forward") {
            Rule = ForwardRule;
        } else {
            res.status(400).json({ message: "Invalid rule type" });
            return;
        }

        // make sure unique name is provided check if name already exist if so return error
        let check_rule = await Rule.find({ _id: req.body.id });
        if (check_rule.length === 0) {
            res.status(400).json({ message: "Invalid Id parameter" });
            return;
        }

        // make sure unique name is provided check if name already exist if so return error
        let check_name = await Rule.find({ name: req.body.name });
        if (check_name.length > 0 && check_name[0]._id != req.body.id) {
            res.status(400).json({ message: "Rule name already exists" });
            return;
        }
        
        const updatedRule = await Rule.updateOne(
            { _id: req.body.id },
            {
                $set: {
                    name: req.body.name,
                    act: req.body.act,
                    protoc: req.body.protoc,
                    FL: req.body.FL,
                    to: req.body.to,
                    cond: req.body.cond,
                    desc: req.body.desc,
                    pol: req.body.pol,
                    disabled: req.body.disabled,
                },
            }
        );
        res.json(updatedRule);
    } catch (err) {
        res.json({ message: err });
    }
});

// move up/down rule
router.post("/move/:order", verifyUser, async (req, res) => {
    try {

        // Rule is the database model for the rule type
        let Rule = null;

        if (req.body.rule_type == "input") {
            Rule = InputRule;
        } else if (req.body.rule_type == "output") {
            Rule = OutputRule;
        } else if (req.body.rule_type == "forward") {
            Rule = ForwardRule;
        } else {
            res.status(400).json({ message: "Invalid rule type" });
            return;
        }

        const rules = await Rule.find();
        let ruleToMove = await Rule.findOne({ order: req.params.order });
        if (!ruleToMove) {
            res.json({ message: "Rule not found" });
        }
        const direction = req.body.direction;
        // check if direction is either up or down if not return error
        if (direction != "up" && direction != "down") {
            res.json({ message: "Invalid direction" });
        } 
        
        // if the rule is already at the top or bottom of the list, do nothing
        if (ruleToMove.order == 1 && direction == "up") {
            res.json({ message: "Rule is already at the top of the list" });
        } else if (
            ruleToMove.order == rules.length &&
            direction == "down"
        ) {
            res.json({ message: "Rule is already at the bottom of the list" });
        } else { // else, move the rule up or down
            let targetOrder;
            if (direction === "up") {
                targetOrder = ruleToMove.order - 1;
            } else {
                targetOrder = ruleToMove.order + 1;
            }

            const targetRule = await Rule.findOne({ order: targetOrder });

            // swap order and id of the two rules
            const tempOrder = ruleToMove.order;
            ruleToMove.order = targetRule.order;
            targetRule.order = tempOrder;

            await ruleToMove.save();
            await targetRule.save();

            res.json({ message: "Rule moved successfully" });
        }
    } catch (err) {
        console.log(err)
        res.json({ message: err });
    }
});




module.exports = router;