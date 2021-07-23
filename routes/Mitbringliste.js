const express = require("express");
const router = express.Router();
const User = require("../db/User");
const Item = require("../db/Item");

router.get("/mitbringliste", (req, res) => {
    if (req.isAuthenticated()) {

        User.find({
            _id: req.session.passport.user
        }, (err, users) => {
            if (err) {
                console.log(err);
                res.render("start", {
                    category: "B"
                });
            } else {
                Item.find(function (err, foundItems) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.render("mitbringliste", {
                            listTitle: "Today",
                            checkedItems: foundItems,
                            category: users[0].category
                        });
                    }
                });
            }
        });

    } else {
        res.redirect("/login");
    }
});

// Export module
module.exports = router;