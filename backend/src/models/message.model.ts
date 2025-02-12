import mongoose, { Document, Schema, Model } from "mongoose";

// Define an interface for the Message document
export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  text?: string;
  image?: string;
}

// Define the Message schema
const messageSchema: Schema<IMessage> = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

// Create the Message model
const Message: Model<IMessage> = mongoose.model<IMessage>("Message", messageSchema);

export default Message;
