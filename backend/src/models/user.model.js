import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
      default:
        "https://w0.peakpx.com/wallpaper/909/574/HD-wallpaper-avengers-2-age-of-ultron-captain-america-hulk-iron-man-thor-thumbnail.jpg",
    },
    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the same User collection
        default: [], // Default to an empty array
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
