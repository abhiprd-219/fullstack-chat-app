// import User from "../models/user.model";
// import Message from "../models/message.model";
// import { getReceiverSocketId, io } from "../lib/socket";

// export const getUsersForSidebar = async (req, res) => {
//   try {
//     const loggedInUserId = req.user._id;
//     const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

//     res.status(200).json(filteredUsers);
//   } catch (error) {
//     console.error("Error in getUsersForSidebar: ", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const getMessages = async (req, res) => {
//   try {
//     const { id: userToChatId } = req.params;
//     const myId = req.user._id;

//     const messages = await Message.find({
//       $or: [
//         { senderId: myId, receiverId: userToChatId },
//         { senderId: userToChatId, receiverId: myId },
//       ],
//     });

//     res.status(200).json(messages);
//   } catch (error) {
//     console.log("Error in getMessages controller: ", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const markMessageAsSeen = async (req, res) => {
//   try {
//     const { messageId } = req.params; // Extract the message ID from the request params

//     // Update the "seen" field of the specified message
//     const updatedMessage = await Message.findByIdAndUpdate(
//       messageId,
//       { seen: true }, // Set the seen field to true
//       { new: true } // Return the updated document
//     );

//     // If the message does not exist, return a 404 error
//     if (!updatedMessage) {
//       return res.status(404).json({ error: "Message not found" });
//     }

//     // Respond with the updated message
//     res.status(200).json(updatedMessage);
//   } catch (error) {
//     console.log("Error in markMessageAsSeen controller: ", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const sendMessage = async (req, res) => {
//   try {
//     const { text, image } = req.body;
//     const { id: receiverId } = req.params;
//     const senderId = req.user._id;

//     let imageUrl;
//     // if (image) {
//     //   // Upload base64 image to cloudinary
//     //   const uploadResponse = await cloudinary.uploader.upload(image);
//     //   imageUrl = uploadResponse.secure_url;
//     // }

//     const newMessage = new Message({
//       senderId,
//       receiverId,
//       text,
//       image: imageUrl || null,  // Ensure `image` is handled correctly
//     });

//     await newMessage.save();

//     const receiverSocketId = getReceiverSocketId(receiverId);
//     const senderSocketId = getReceiverSocketId(senderId); // Ensure sender gets the message too

//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("newMessage", newMessage);
//     }

//     if (senderSocketId) {
//       io.to(senderSocketId).emit("newMessage", newMessage); // Ensure sender sees their message instantly
//     }

//     res.status(201).json(newMessage);
//   } catch (error) {
//     console.log("Error in sendMessage controller: ", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
