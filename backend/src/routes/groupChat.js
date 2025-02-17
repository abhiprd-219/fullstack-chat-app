// routes/groupChat.js
import express from 'express';
import GroupChat from '../models/GroupChat';  // Assuming this model exists
import GroupMessage from '../models/GroupMessage';  // Assuming this model exists
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Create Group
router.post('/create', authenticate, async (req, res) => {
  const { name, members } = req.body;

  const groupChat = new GroupChat({
    name,
    members,
    createdBy: req.user._id,
  });

  try {
    await groupChat.save();
    res.status(201).json(groupChat);
  } catch (error) {
    res.status(500).json({ message: 'Error creating group chat' });
  }
});

// Get Group Messages
router.get('/group-messages/:groupId', authenticate, async (req, res) => {
  const { groupId } = req.params;
  try {
    const messages = await GroupMessage.find({ groupId }).populate('senderId', 'fullName');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching group messages' });
  }
});

// Send Group Message
router.post('/send-group-message/:groupId', authenticate, async (req, res) => {
  const { groupId } = req.params;
  const { message } = req.body;

  const groupMessage = new GroupMessage({
    groupId,
    senderId: req.user._id,
    message,
  });

  try {
    await groupMessage.save();
    res.status(201).json(groupMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error sending group message' });
  }
});

export default router;
