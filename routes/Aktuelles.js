const express = require("express");
const router = express.Router();
const User = require("../db/User");
const Post = require("../db/Blog");

router.get("/aktuelles", (req, res) => {

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
        Post.find((err, foundPosts) => {
          if (err) {
            console.log(err);
          } else {

            if (foundPosts.length === 0) {

              const defaultPost = new Post({
                title: "Einladung",
                content: "Wir möchten euch herzlich zu unserer Hochzeit am 5. August einladen. Die Trauung findet um 11:00 Uhr im Neubiberger Trausaal statt. Anfahrtskizzen findet jeweils unter dem Reiter Anfahr.",
                category: "A"
              });

              defaultPost.save();

              res.render("aktuelles", {
                category: users[0].category
              });

            } else {
              res.render("aktuelles", {
                posts: foundPosts,
                category: users[0].category
              });
            }
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