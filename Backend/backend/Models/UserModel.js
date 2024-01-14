const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userModel = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    picture: {
      type: String,
      default:
        "data:image/png;base64,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",
    },
  },
  {
    timestamps: true,
  }
);

userModel.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userModel.pre("save", async function (next) {
  if (!this.isModified()) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("userModel", userModel);

module.exports = User;
