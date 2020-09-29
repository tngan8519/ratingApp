/**
 * router.post("/", controller.postRate);
router.get("/:rate_id/edit", controller.editRate);
router.put("/:rate_id", controller.uppdateRate);
router.delete("/:rate_id", controller.deleteRate);
module.exports = router;
 * 
 */
var Individual = require("../models/individual");
var Rate = require("../models/rate");
module.exports.postRate = function (req, res) {
  Individual.findById(req.params.id)
    .populate("rates")
    .exec(function (err, foundIndividual) {
      if (err) {
        console.log(err);
        return res.redirect("back");
      }

      Rate.create(req.body.rate, function (err, newlyCreate) {
        if (err) {
          console.log(err);
          return res.redirect("back");
        }

        newlyCreate.author.id = req.user._id;
        newlyCreate.author.username = req.user.username;
        newlyCreate.individual = foundIndividual;
        newlyCreate.save();

        foundIndividual.rates.push(newlyCreate);

        foundIndividual.rating = calculateAverage(foundIndividual.rates);
        foundIndividual.save();
        console.log(foundIndividual.author.username);
        res.redirect("/individual/" + req.params.id);
      });
    });
};
module.exports.uppdateRate = function (req, res) {
  Rate.findByIdAndUpdate(
    req.params.rate_id,
    req.body.rate,
    { new: true },
    function (err, uppdateRate) {
      if (err) {
        console.log(err);
        return res.redirect("back");
      }
      Individual.findById(req.params.id)
        .populate("rates")
        .exec(function (err, individual) {
          if (err) {
            console.log(err);
            return res.redirect("back");
          }
          individual.rating = calculateAverage(individual.rates);
          individual.save();
          res.redirect("back");
        });
    }
  );
};
module.exports.deleteRate = function (req, res) {
  Rate.findByIdAndRemove(req.params.rate_id, function (err) {
    if (err) {
      console.log(err);
      return res.redirect("back");
    }
    Individual.findByIdAndUpdate(
      req.params.id,
      { $pull: { rates: req.params.rate_id } },
      { new: true }
    )
      .populate("rates")
      .exec(function (err, individual) {
        if (err) {
          console.log(err);
          return res.redirect("back");
        }
        individual.rating = calculateAverage(individual.rates);
        individual.save();
        res.redirect("/individual/" + req.params.id);
      });
  });
};

function calculateAverage(arr) {
  if (arr.length === 0) {
    return 0;
  }
  var sum = 0;
  arr.forEach(function (element) {
    sum += element.rating;
  });
  return sum / arr.length;
}
