//jshint esversion:6

// Environment variables
require("dotenv").config()

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const encrypt = require("mongoose-encryption");

const news = require("./news.js");

const app = express();
const port = process.env.PORT || 3000;

//app.use(express.static("public"));
app.use("/public", express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");

// https://www.npmjs.com/package/express-session
app.use(session({
  secret: process.env.SECRET_PASSPORT,
  resave: false,
  saveUninitialized: false
}));

// http://www.passportjs.org/docs/configure/
app.use(passport.initialize());
app.use(passport.session());

//////////////////////////// DB setup ////////////////////////////
// connect with mongodb --> mongod --dbpath ~/data/db --> mongo
const connectionTest = "mongodb://localhost:27017/weddingDB";
const connectionProd = "mongodb+srv://" + process.env.USERNAMEDB + ":" + process.env.PASSWORDDB + "@cluster0.v4edf.mongodb.net/weddingDB?retryWrites=true&w=majority";
mongoose.connect(connectionProd, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

// To solve the DeprecationWarning "collection.ensureIndex is deprecated. Use createIndexes instead"
mongoose.set("useCreateIndex", true);

//////////////////////////// schemas for DB ////////////////////////////
const userSchema = new mongoose.Schema({
  username: String,
  category: String,
  password: String,
  secret: String
});

const blogPostsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "No title added."]
  },
  content: {
    type: String,
    required: [true, "No content added."]
  },
  category: String
});

const itemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "No item added."]
  },
  checked: Boolean
});

const guestsSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  category: String,
  foreignID: String
});

//////////////////////////// Plugins for mongoose.js ////////////////////////////
// Mongoose plugin: https://mongoosejs.com/docs/plugins.html
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
blogPostsSchema.plugin(encrypt, {
  secret: process.env.SECRET_POSTS
});
itemsSchema.plugin(encrypt, {
  secret: process.env.SECRET_ITEMS
});
guestsSchema.plugin(encrypt, {
  secret: process.env.SECRET_GUESTS,
  excludeFromEncryption: ["foreignID"]
});

//////////////////////////// Setup Collections ////////////////////////////
const User = new mongoose.model("User", userSchema);
const Post = new mongoose.model("BlogPost", blogPostsSchema);
const Item = new mongoose.model("Item", itemsSchema);
const Guest = new mongoose.model("Guest", guestsSchema);

//////////////////////////// Setup passpot.js ////////////////////////////
passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

//////////////////////////// routes ////////////////////////////
app.get("/", (req, res) => {
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
        res.render("start", {
          category: users[0].category
        });
      }
    });
  } else {
    res.render("login");
  }
});

app.get("/login", (req, res) => {
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
        res.render("start", {
          category: users[0].category
        });
      }
    });
  } else {
    res.render("login");
  }
});

app.get("/register", (req, res) => {
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
        res.render("start", {
          category: users[0].category
        });
      }
    });
  } else {
    res.render("register");
  }
});

app.get("/start", (req, res) => {
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
        res.render("start", {
          category: users[0].category
        });
      }
    });

  } else {
    res.redirect("/login");
  }
});

app.get("/aktuelles", (req, res) => {

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

app.get("/mitbringliste", (req, res) => {
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
            console.log(foundItems);
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
app.get("/standesamt", (req, res) => {
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
        res.render("standesamt", {
          category: users[0].category
        });
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/truderinger-wirtshaus", (req, res) => {
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
        res.render("truderinger-wirtshaus", {
          category: users[0].category
        });
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/feuerwehr", (req, res) => {
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
        res.render("feuerwehr", {
          category: users[0].category
        });
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/gaeste-verwaltung", (req, res) => {

  if (req.isAuthenticated()) {

    Guest.find({
      foreignID: req.session.passport.user
    }, (err, users) => {

      // Check if error connecting
      if (err) {
        res.json({
          success: false,
          message: err
        }); // Return error
      } else {
        res.render("gaeste", {
          guests: users,
          category: users[0].category
        });
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/change-email", (req, res) => {
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
        res.render("change-email", {
          category: users[0].category
        });
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/change-password", (req, res) => {
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

app.get("/admin", (req, res) => {
  if (req.isAuthenticated()) {

    Guest.find({}, (err, users) => {

      // Check if error connecting
      if (err) {
        res.json({
          success: false,
          message: err
        }); // Return error
      } else {

        res.render("admin", {
          guests: users,
          category: users[0].category
        });
      }
    });

  } else {
    res.redirect("/login");
  }
});

//////////////////////////// logout ////////////////////////////
app.get("/logout", function (req, res) {

  // end current session and redirect
  req.logout();
  res.redirect("/");

});

app.get("/compose-blogpost", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("compose-blogbost", {
      category: "A"
    });
  } else {
    res.redirect("aktuelles");
  }
});

//////////////////////////// register a new user ////////////////////////////
app.post("/register", function (req, res) {

  console.log(req.body);

  User.register({
      username: req.body.username,
      category: req.body.category
    },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.render("answer", {
          alert: "Error: ",
          route: "/login",
          message: err
        });
      } else {
        passport.authenticate("local")(req, res, function () {

          const userID = req.session.passport.user;
          const newGuest = new Guest({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            category: req.body.category,
            foreignID: userID
          });

          newGuest.save();

          res.redirect("/start");
        });
      }
    }
  );

});

//////////////////////////// login the new user ////////////////////////////
app.post("/login", function (req, res) {

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  // use passport to login the user:
  req.login(user, function (err) {

    if (err) {
      console.log(err);
      res.render("answer", {
        alert: "Fehler",
        route: "/login",
        message: err
      });
    } else {
      passport.authenticate("local")(req, res, function (err) {
        res.redirect("/start");
      });
    }
  });
});

//////////////////////////// change password ////////////////////////////
app.post("/change-password", function (req, res) {

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

//////////////////////////// change email ////////////////////////////
app.post("/change-email", function (req, res) {

  if (req.isAuthenticated()) {
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
          user.username = req.body.newemail;
          user.save(err => {
            if (err) {
              res.render("answer", {
                alert: "Fehler",
                route: "/change-email",
                message: "Etwas ist schief gegangen! Bitte versuchen Sie es erneut."
              });
            } else {
              res.render("answer", {
                alert: "Geschafft!",
                route: "/change-email",
                message: "Die Email-Adresse wurde erfolgreich geändert."
              });
            }
          });
        }
      }
    });
  }

});

//////////////////////////// post new item ////////////////////////////
app.post("/newItem", function (req, res) {

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
app.post("/updateItem", function (req, res) {

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
              console.log("updated Item");
              res.redirect("/mitbringliste");
            }
          });         
      }
    });
  }
});

//////////////////////////// add a new guest ////////////////////////////
app.post("/add-guest", function (req, res) {

  User.find({
    _id: req.session.passport.user
  }, (err, users) => {
    if (err) {
      console.log(err);
      res.redirect("/gaeste-verwaltung");
    } else {
      const userID = req.session.passport.user;

      if (req.isAuthenticated()) {
        const newGuest = new Guest({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          category: users[0].category,
          foreignID: userID
        });

        newGuest.save();
        res.redirect("/gaeste-verwaltung");
      }
    }
  });
});

//////////////////////////// add a new blogpost ////////////////////////////
app.post("/new-post", function (req, res) {

  if (req.isAuthenticated()) {
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category
    });

    newPost.save();
    res.redirect("/aktuelles");
  }

});

//////////////////////////// server ////////////////////////////
app.listen(port, function () {
  console.log("Server started on port " + port);
});