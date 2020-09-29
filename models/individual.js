var mongoose = require("mongoose");

var individualSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },
  rates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rate",
    },
  ],
  rating: {
    type: Number,
    default: 0,
  },
});

var Individual = mongoose.model("Individual", individualSchema);

module.exports = Individual;
