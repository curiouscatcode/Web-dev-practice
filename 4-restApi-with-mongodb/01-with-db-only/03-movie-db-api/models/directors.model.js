const mongoose = require("mongoose");

const DirectorsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter the name of director !"],
    },
    dateOfBirth: {
      type: Date,
    },
    bio: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Directors = mongoose.model("Directors", DirectorsSchema);

module.exports = Directors;
