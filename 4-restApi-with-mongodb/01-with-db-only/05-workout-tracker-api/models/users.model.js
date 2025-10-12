const mongoose = require("mongoose");

const UsersSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "enter the name !"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UsersSchema);

module.exports = User;
