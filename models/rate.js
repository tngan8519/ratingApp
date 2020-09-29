var mongoose = require("mongoose");

var rateSchema = new mongoose.Schema(
  {
    rating: Number,
    // {
    //   type: Number,
    // required: "Required rating 1-5 stars",
    // min: 1,
    // max: 5,
    // xem coi co the bo validate duoc khong vi da cho chon radio button form
    // validate: {
    //   validator: Number.isInteger,
    //   message: "required an integer",
    // },
    // }
    text: {
      type: String,
    },
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      username: String,
    },
    individual: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Individual",
    },
  },
  {
    timestamps: true,
  }
);

var Rate = mongoose.model("Rate", rateSchema);

module.exports = Rate;
