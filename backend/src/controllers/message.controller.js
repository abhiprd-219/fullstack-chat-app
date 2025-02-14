import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {

    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markMessagesAsSeen = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; // The ID of the user whose messages are being marked as seen
    const myId = req.user._id;

    // Update all messages where the user is the receiver and the `seen` field is false
    await Message.updateMany(
      { senderId: userToChatId, receiverId: myId, seen: false },
      { $set: { seen: true } }
    );

    res.status(200).json({ message: "All messages marked as seen successfully" });
  } catch (error) {
    console.error("Error in markMessagesAsSeen controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};




export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    // Uncomment this block if you're using image upload to Cloudinary
    // if (image) {
    //   const uploadResponse = await cloudinary.uploader.upload(image);
    //   imageUrl = uploadResponse.secure_url;
    // }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl || null,
      // Initialize the seen field to false for all new messages
    });

    

    await newMessage.save();

    // Notify receiver and sender via WebSocket
    const receiverSocketId = getReceiverSocketId(receiverId);
    const senderSocketId = getReceiverSocketId(senderId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

