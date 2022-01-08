var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Individual = require("./models/individual");
var User = require("./models/user");
var Rate = require("./models/rate");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");

var indexRoutes = require("./routes/indexRoutes");
var individualRoutes = require("./routes/individualRoutes");
var rateRoutes = require("./routes/rateRoutes");

mongoose.connect("mongodb://localhost:27017/rating", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
// template engine
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(
  require("express-session")({
    secret: "keysecret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", indexRoutes);
app.use("/individual", individualRoutes);
app.use("/individual/:id/rate", rateRoutes);

app.listen(3000, function () {
  console.log("Server has started");
});
