var Individual = require("../models/individual");
var User = require("../models/user");
var FunctionSort = require("../function/sort");
var passport = require("passport");

module.exports.goIndexPage = function (req, res) {
  res.render("home");
};
module.exports.search = function (req, res) {
  var q = req.query.q;

  Individual.find({})
    .populate({ path: "rates", options: { sort: { createdAt: -1 } } })
    .exec(function (err, allIndividuals) {
      if (err) {
        console.log(err);
      } else {
        var matchIndividuals = allIndividuals.filter(function (a) {
          return a.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
        });
        var topRatingIndiviudals = FunctionSort.sortTopRatingIndiviudal(
          allIndividuals
        );

        res.render("search", {
          individuals: matchIndividuals,
          topRatingIndiviudals: topRatingIndiviudals.slice(0, 3),
        });
      }
    });
};
module.exports.sort = function (req, res) {
  var q = req.query.sorting;
  Individual.find({})
    .populate({ path: "rates", options: { sort: { createdAt: -1 } } })
    .exec(function (err, allIndividuals) {
      if (err) {
        console.log(err);
      } else {
        var matchIndividuals;
        var newObjectIndividuals = [];
        for (var i = 0; i < allIndividuals.length; i++) {
          newObjectIndividuals.push(allIndividuals[i]);
        }

        var topRatingIndiviudals = FunctionSort.sortTopRatingIndiviudal(
          newObjectIndividuals
        );
        switch (q) {
          case "highestRate":
            matchIndividuals = FunctionSort.sortTopRatingIndiviudal(
              allIndividuals
            );
            break;
          case "lowestRate":
            matchIndividuals = allIndividuals.sort(function (a, b) {
              return a.rating - b.rating;
            });
            break;
          case "newest":
            matchIndividuals = allIndividuals.sort(function (a, b) {
              if (a.rates[0] && b.rates[0]) {
                return a.rates[0].updatedAt - b.rates[0].updatedAt;
              } else if (a.rates[0]) {
                return a.rates[0].updatedAt;
              } else if (b.rates[0]) {
                return b.rates[0].updatedAt;
              } else {
                return 0;
              }
            });
            break;
          case "oldest":
            matchIndividuals = allIndividuals.sort(function (a, b) {
              if (a.rates[0] && b.rates[0]) {
                return b.rates[0].updatedAt - a.rates[0].updatedAt;
              } else if (a.rates[0]) {
                return 0 - a.rates[0].updatedAt;
              } else if (b.rates[0]) {
                return 0 - b.rates[0].updatedAt;
              } else {
                return 0;
              }
            });
            break;
          case "abc":
            matchIndividuals = allIndividuals.sort(function (a, b) {
              return a.name.localeCompare(b.name);
            });
            break;
          case "z":
            matchIndividuals = allIndividuals.sort(function (a, b) {
              return b.name.localeCompare(a.name);
            });
            break;
          default:
            matchIndividuals = allIndividuals;
            break;
        }

        res.render("search", {
          individuals: matchIndividuals,
          topRatingIndiviudals: topRatingIndiviudals.slice(0, 3),
        });
      }
    });
};
module.exports.register = function (req, res) {
  res.render("register");
};
module.exports.postRegister = function (req, res) {
  var newUser = new User({ username: req.body.username });
  if (req.body.adminCode === "ADMINCODE") {
    newUser.isAdmin = true;
  }

  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render("register", { error: err.message });
    }
    passport.authenticate("local")(req, res, function () {
      res.render("home", { success: "hello " + user.username });
    });
  });
};
module.exports.login = function (req, res) {
  res.render("login");
};
module.exports.postLogin = function (req, res) {};
module.exports.logout = function (req, res) {
  req.logout();
  res.redirect("/");
};

// var cloneObj = function (obj) {
//   return Object.keys(obj).reduce((dolly, key) => {
//     dolly[key] =
//       obj[key].constructor === Object ? cloneObj(obj[key]) : obj[key];
//     return dolly;
//   }, {});
// };
