// routes/groupChat.js
const express = require('express');
const router = express.Router();
const GroupChat = require('../models/GroupChat');
const GroupMessage = require('../models/GroupMessage');
const { authenticate } = require('../middleware/auth');

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

// Get User's Groups
router.get('/user-groups', authenticate, async (req, res) => {
  try {
    const groups = await GroupChat.find({ members: req.user._id }).populate('members', 'fullName');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user groups' });
  }
});

// Get Messages of a Group
router.get('/group-messages/:groupId', authenticate, async (req, res) => {
  const { groupId } = req.params;
  try {
    const messages = await GroupMessage.find({ groupId }).populate('senderId', 'fullName');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// Send Message to Group
router.post('/send-message/:groupId', authenticate, async (req, res) => {
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
    res.status(500).json({ message: 'Error sending message' });
  }
});

// Mark Messages as Seen
router.put('/mark-seen/:groupId', authenticate, async (req, res) => {
  const { groupId } = req.params;

  try {
    const messages = await GroupMessage.find({ groupId, seenBy: { $ne: req.user._id } });
    messages.forEach(async (message) => {
      message.seenBy.push(req.user._id);
      await message.save();
    });
    res.status(200).json({ message: 'Messages marked as seen' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking messages as seen' });
  }
});

module.exports = router;
