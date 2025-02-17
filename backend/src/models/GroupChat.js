// models/GroupChat.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const groupChatSchema = new Schema({
  name: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const GroupChat = mongoose.model('GroupChat', groupChatSchema);
module.exports = GroupChat;

// models/GroupMessage.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const groupMessageSchema = new Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'GroupChat', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const GroupMessage = mongoose.model('GroupMessage', groupMessageSchema);
module.exports = GroupMessage;
