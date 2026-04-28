import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    title: { type: String, default: 'New conversation' },
    language: { type: String, default: 'en' },
    lastMessageAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
