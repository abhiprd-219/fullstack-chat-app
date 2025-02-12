import mongoose, { Document, Schema, Model } from "mongoose";

// Define an interface for the User document
export interface IUser extends Document {
  email: string;
  fullName: string;
  password: string;
  profilePic?: string;
}

// Define the User schema
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Create the User model
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
