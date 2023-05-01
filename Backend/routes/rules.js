var express = require("express");
var router = express.Router();

const { getToken, COOKIE_OPTIONS, getRefreshToken, verifyUser } = require("../authenticate")
const { exec } = require("child_process");



let InputRule = require("../models/InputRule");
let OutputRule = require("../models/OutputRule");
let ForwardRule = require("../models/ForwardRule");
const { ObjectID } = require("bson");

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

router.post("/add", verifyUser, async (req, res) => {
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
        let check_rule = await Rule.find({ name: req.body.name });
        if (check_rule.length > 0) {
            res.status(400).json({ message: "Rule name already exists" });
            return;
        }

        const rules = await Rule.find();
        for (let i = rules.length - 1; i >= 0; i--) {
            rules[i].order++;
            await rules[i].save();
        }

        const rule = new Rule({
            order: 1,
            name: req.body.name,
            act: req.body.act,
            protoc: req.body.protoc,
            FL: req.body.FL,
            to: req.body.to,
            cond: req.body.cond,
            desc: req.body.desc,
            disabled: req.body.disabled,
            ports: req.body.ports
        });


        const savedRule = await rule.save();

        res.json(savedRule);
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
        const command = `sudo iptables -D ${req.body.rule_type} ${removedRule.order}`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        });        

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