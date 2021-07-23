const express = require("express");
const router = express.Router();
const User = require("../db/User");

router.get("/change-password", (req, res) => {
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
                res.render("change-password", {
                    category: users[0].category
                });
            }
        });
    } else {
        res.redirect("/login");
    }
});

//////////////////////////// change password ////////////////////////////
router.post("/change-password", function (req, res) {

    if (req.isAuthenticated()) {
        if (req.body.newpassword === req.body.repeatnewpassword) {
            User.findOne({
                _id: req.session.passport.user
            }, (err, user) => {

                // Check if error connecting
                if (err) {
                    res.json({
                        success: false,
                        message: err
                    }); // Return error
                } else {
                    // Check if user was found in database
                    if (!user) {
                        res.render("answer", {
                            alert: "Fehler",
                            route: "/change-password",
                            message: "Nutzer nicht gefunden."
                        });
                    } else {
                        user.changePassword(req.body.oldpassword, req.body.newpassword, function (err) {
                            if (err) {
                                if (err.name === "IncorrectPasswordError") {
                                    res.render("answer", {
                                        alert: "Fehler",
                                        route: "/change-password",
                                        message: "Etwas ist schief gegangen! Bitte versuchen Sie es erneut."
                                    });
                                } else {
                                    res.render("answer", {
                                        alert: "Fehler",
                                        route: "/change-password",
                                        message: "Etwas ist schief gegangen! Bitte versuchen Sie es erneut."
                                    });
                                }
                            } else {
                                res.render("answer", {
                                    alert: "Geschafft!",
                                    route: "/change-password",
                                    message: "Das Passwort wurde erfolgreich geändert."
                                });
                            }
                        });
                    }
                }
            });
        } else {
            res.render("answer", {
                alert: "Fehler",
                route: "/change-password",
                message: "Die zwei Passwörter stimmen nicht überein."
            });
        }
    }

});

// Export module
module.exports = router;