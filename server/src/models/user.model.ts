import mongoose, { Model, Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
require("dotenv").config();

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  tasks: string[];
  signAccessToken: () => string;
  signRefreshToken: () => string;
  comparePassword: (enteredPassword: string) => Promise<boolean>;
}

//emailRegex for email @ validation
const emailRegex: RegExp = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

//User Schema
export const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      match: [emailRegex, "Please enter a valid email address"],
    },
    password: {
      type: String,
      minlength: [6, "Your password must be longer than 6 characters"],
      select: false,
    },
    tasks: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  { timestamps: true }
);

//Hash Password before saving user
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

//sign access token
userSchema.methods.signAccessToken = function (): string {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET || "", {
    expiresIn: "5m",
  });
};

//sign refresh token
userSchema.methods.signRefreshToken = function (): string {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET || "", {
    expiresIn: "3d",
  });
};

//compare password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User: Model<IUser> = mongoose.model("User", userSchema);
