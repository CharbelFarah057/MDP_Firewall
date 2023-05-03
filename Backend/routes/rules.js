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



async function executeIptablesCommand(req, rule_name, chain, source, destination, dports_tcp, dports_udp, sports_lsp, sports_asp, action, count) {
    let commands_to_run = [];

    if (dports_tcp.length > 0){
        const command_tcp = `sudo iptables -I ${chain} -s ${source} -d ${destination} -p tcp -m multiport --dport ${dports_tcp.join(",")} -j ${action}`
        commands_to_run.push(command_tcp)
    }
    if (dports_udp.length > 0){
        const command_udp = `sudo iptables -I ${chain} -s ${source} -d ${destination} -p udp -m multiport --dport ${dports_udp.join(",")} -j ${action}`
        commands_to_run.push(command_udp)
    }
    const createdRules = [];
    for (let i = 0; i < commands_to_run.length; i++) {
        try {
          await exec(commands_to_run[i]);
          console.log(`Command executed successfully: ${commands_to_run[i]}\n`);
        } catch (error) {
          console.error(`Error executing command: ${commands_to_run[i]}`);
        }
        let ruleType = chain.toUpperCase();
        let modelName1 = `${rule_name}_${count}`;
        if (i == 0) {
            modelName1 = `${modelName1}_tcp`
        }
        else if (i == 1) {
            modelName1 = `${modelName1}_udp`
        }
        
        let response1 = await createRule(req, ruleType, modelName1);
        console.log(response1)
        // if (response1.status) {
        //     throw new Error(response1.message);
        // }
        
        createdRules.push(response1.json);
      }
    

    return createdRules;
}


  


async function createRule(req, ruleType, modelName) {
    let Rule = null;
    ruleType = ruleType.toLowerCase()
    console.log("rule is " + ruleType)
    if (ruleType === "input") {
        Rule = InputRule;
    } else if (ruleType === "output") {
        Rule = OutputRule;
    } else if (ruleType === "forward") {
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

    const rule = new Rule({
        order: 1,
        name: modelName,
        action: req.body.action,
        protocol: req.body.protocol,
        source_network: req.body.source_network,
        destination_network: req.body.destination_network,
        description: req.body.desc,
        ports: req.body.ports
    });

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
        const ruleType = rule.rule_type;
        const modelName = rule.name;

        const chain = ruleType.toUpperCase();
        const sourceNetworks = getSourceNetworks(user, rule.source_network);
        const destinationNetworks = getDestinationNetworks(user, rule.destination_network);
        const protocol = rule.protocol;
        const action = rule.action.toUpperCase();
        const dports_tcp = protocol.selectedProtocols.tcp;
        const dports_udp = protocol.selectedProtocols.udp;
        const sports_lsp = rule.source_ports.limitedSourcePort; 
        const sports_asp = rule.source_ports.anySourcePort;
        console.log(destinationNetworks)
        const createdRules = [];
        let count = 0;
        for (const source of sourceNetworks) {
            for (const destination of destinationNetworks) {
                try {
                    const executedRules = await executeIptablesCommand(req, modelName, chain, source, destination, dports_tcp, dports_udp, sports_lsp, sports_asp, action, count);
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