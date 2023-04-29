var express = require("express");
var router = express.Router();

const { getToken, COOKIE_OPTIONS, getRefreshToken, verifyUser } = require("../authenticate")
const { exec } = require("child_process");


let Rule = require("../models/Rule");

// GET all rules from the database 
router.get("/", verifyUser, async (req, res) => {
    try {
        let rules = await Rule.find();
        // return rules in order based on the "order" field
        rules.sort((a, b) => (a.order > b.order) ? 1 : -1);
        res.json(rules);
    } catch (err) {
        res.json({ message: err });
    }
});

// GET a specific rule from the database check "order" field 
router.get("/:id", verifyUser, async (req, res) => {
    try {
        const rule = await Rule.findOne({ id: req.params.id });
        res.json(rule);
    } catch (err) {
        res.json({ message: err });
    }
});

router.post("/add", verifyUser, async (req, res) => {
    try {
        const rules = await Rule.find();
        for (let i = rules.length - 1; i >= 0; i--) {
            rules[i].order++;
            await rules[i].save();
        }
    } catch (err) {
        res.json({ message: err });
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

    // sudo iptables -i {}

    try {
        const savedRule = await rule.save();
        res.json(savedRule);
    } catch (err) {
        res.json({ message: err });
    }
});

// delete rule
router.post("/delete/:id", verifyUser, async (req, res) => {
    try {
        const removedRule = await Rule.deleteOne({ id: req.params.id });
        res.json(removedRule);
    } catch (err) {
        res.json({ message: err });
    }
});

// update rule
router.post("/edit/:id", verifyUser, async (req, res) => {
    try {
        const updatedRule = await Rule.updateOne(
            { id: req.params.id },
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