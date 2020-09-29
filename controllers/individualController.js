var Individual = require("../models/individual");
var FunctionSort = require("../function/sort");
var fs = require("fs");
var path = require("path");

// lam them ve tim ra nhieu nguoi rate va rate nhieu nhat bang cach tim va them gia tri vao luc render

module.exports.showPage = function (req, res) {
  Individual.find({})
    .populate({ path: "rates", options: { sort: { createdAt: -1 } } })
    .exec(function (err, allIndividuals) {
      if (err) {
        console.log(err);
      } else {
        var topRatingIndiviudals = FunctionSort.sortTopRatingIndiviudal(
          allIndividuals
        );
        res.render("search", {
          individuals: allIndividuals,
          topRatingIndiviudals: topRatingIndiviudals.slice(0, 3),
        });
      }
    });
};

module.exports.postNewIndividual = function (req, res) {
  var newIndividual = {
    name: req.body.name,
    image: req.file.path.split("/").slice(1).join("/"),
    description: req.body.description,
    author: { id: req.user._id, username: req.user.username },
  };

  Individual.create(newIndividual, function (err, newlyCreated) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/individual");
    }
  });
};
module.exports.showCreateIndividualForm = function (req, res) {
  res.render("createIndividual");
};
// trang detail can lam them hien thi ai rate ngay va neu muon rate thi phai dang nhap, sau do moi rate, sau do moi post
module.exports.showDetail = function (req, res) {
  Individual.findById(req.params.id)
    .populate({ path: "rates", options: { sort: { createdAt: -1 } } })
    .exec(function (err, foundIndividual) {
      if (err) {
        console.log(err);
      } else {
        res.render("detail", { individual: foundIndividual });
      }
    });
};

module.exports.showEditIndividualForm = function (req, res) {
  Individual.findById(req.params.id, function (err, foundIndividual) {
    if (err) {
      console.log(err);
    } else {
      res.render("editIndividual", { individual: foundIndividual });
    }
  });
};
module.exports.updateIndividual = function (req, res) {
  Individual.findById(req.params.id, function (err, foundIndividual) {
    if (err) {
      console.log(err);
    } else {
      if (req.file) {
        var link = path.join(__dirname, "../public/" + foundIndividual.image);
        fs.unlinkSync(link, function (err) {
          if (err) {
            res.redirect("back");
            console.log(err);
          }
        });
        foundIndividual.image = req.file.path.split("/").slice(1).join("/");
      }
      foundIndividual.name = req.body.name;
      foundIndividual.description = req.body.description;
      foundIndividual.save();
      res.redirect("/individual/" + req.params.id);
    }
  });
};
module.exports.deleteIndividual = function (req, res) {
  Individual.findById(req.params.id, function (err, foundIndividual) {
    if (err) {
      res.redirect("back");
    } else {
      var link = path.join(__dirname, "../public/" + foundIndividual.image);
      fs.unlinkSync(link, function (err) {
        if (err) {
          console.log(err);
          res.redirect("back");
        }
      });
      foundIndividual.remove();
      res.redirect("/individual");
    }
  });
};
