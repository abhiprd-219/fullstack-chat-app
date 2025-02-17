// controllers/group.controller.js
import Group from "../models/group.model.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const createGroup = async (req, res) => {
  const { name, description, members } = req.body;
  const adminId = req.user._id;

  try {
    const group = new Group({
      name,
      description,
      admin: adminId,
      members: [...members, adminId],
    });

    await group.save();
    res.status(201).json(group);
  } catch (error) {
    console.log("Error in createGroup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addMembersToGroup = async (req, res) => {
  const { groupId } = req.params;
  const { members } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    group.members = [...group.members, ...members];
    await group.save();
    res.status(200).json(group);
  } catch (error) {
    console.log("Error in addMembersToGroup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendGroupMessage = async (req, res) => {
  const { groupId } = req.params;
  const { text, image } = req.body;
  const senderId = req.user._id;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.members.includes(senderId)) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    const newMessage = new Message({
      senderId,
      groupId,
      text,
      image,
    });

    await newMessage.save();

    // Notify all group members via WebSocket
    group.members.forEach((memberId) => {
      const socketId = getReceiverSocketId(memberId);
      if (socketId) {
        io.to(socketId).emit("newGroupMessage", newMessage);
      }
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendGroupMessage controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};