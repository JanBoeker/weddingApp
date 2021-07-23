const express = require("express");
const router = express.Router();
const User = require("../db/User");

//////////////////////////// post new item ////////////////////////////
router.post("/newItem", function (req, res) {

    if (req.isAuthenticated()) {
        const newItem = new Item({
            name: req.body.newItem,
            checked: false
        });

        newItem.save();
        res.redirect("/mitbringliste");
    }
});

//////////////////////////// delete from item list ////////////////////////////
router.post("/updateItem", function (req, res) {

    const checkedItemId = req.body.checkbox;

    if (req.isAuthenticated()) {
        Item.findOne({
            _id: checkedItemId
        }, (err, foundItem) => {

            // Check if error connecting
            if (err) {
                console.log(err);
            } else {
                foundItem.checked = true;
                foundItem.save(err => {
                    if (err) {
                        console.log(err);
                        res.redirect("/mitbringliste");
                    } else {
                        res.redirect("/mitbringliste");
                    }
                });
            }
        });
    }
});

// Export module
module.exports = router;