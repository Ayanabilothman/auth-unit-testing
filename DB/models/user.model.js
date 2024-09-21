import mongoose, { model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
      set: (value) => bcrypt.hashSync(value, 8),
    },
    name: String,
    age: Number,
  },
  { timestamps: true }
);

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ email: this.email, id: this.id }, "secretkey");
};

const User = model("User", userSchema);

export default User;
