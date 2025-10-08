const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter the name !"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    purchasedBooks: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
        },
      ],
    },
  },
  {
    timeStamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
