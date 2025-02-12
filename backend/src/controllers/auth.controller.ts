import { Request, Response } from "express";
import { generateToken } from "../lib/utils";
import User, { IUser } from "../models/user.model";
import bcrypt from "bcryptjs";
// import cloudinary from "../lib/cloudinary";

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: "Password must be at least 6 characters" });
      return;
    }

    const user: IUser | null = await User.findOne({ email });

    if (user) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    const salt: string = await bcrypt.genSalt(10);
    const hashedPassword: string = await bcrypt.hash(password, salt);

    const newUser: IUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // Generate JWT token
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error: any) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user: IUser | null = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isPasswordCorrect: boolean = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error: any) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req: Request, res: Response): void => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error: any) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { profilePic } = req.body;
    const userId: string = req.user._id;

    if (!profilePic) {
      res.status(400).json({ message: "Profile pic is required" });
      return;
    }

    // Uncomment and use if cloudinary is enabled
    // const uploadResponse = await cloudinary.uploader.upload(profilePic);
    // const updatedUser: IUser | null = await User.findByIdAndUpdate(
    //   userId,
    //   { profilePic: uploadResponse.secure_url },
    //   { new: true }
    // );

    // Mock updated user for now
    const updatedUser: IUser | null = await User.findByIdAndUpdate(
      userId,
      { profilePic },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error: any) {
    console.log("Error in update profile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req: Request, res: Response): void => {
  try {
    res.status(200).json(req.user);
  } catch (error: any) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};