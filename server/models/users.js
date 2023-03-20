import { Schema, model } from "mongoose";
import { v4 } from "uuid";

const userSchema = new Schema(
  {
    userId: {
      type: String,
      default: () => v4(),
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    profileImage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = model("user", userSchema);

export default User;
