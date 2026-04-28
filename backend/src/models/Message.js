import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    messageType: { type: String, default: 'text' },
    products: {
      type: [
        {
          id: String,
          name: String,
          price: String,
          rating: String,
          description: String,
          imageUrl: String,
          buyUrl: String,
          purchaseLinks: {
            amazon: String,
            flipkart: String
          },
          source: String
        }
      ],
      default: []
    },
    metadata: { type: Object, default: {} }
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
