import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { generateReply } from '../services/aiService.js';
import { ensureMarketplaceCoverage, isShoppingQuery, searchProducts } from '../services/productService.js';

const shoppingOnlyReply = (language = 'en') => (
  language === 'hi'
    ? 'माफ़ कीजिए, मैं एक shopbot हूं और केवल shopping queries में मदद कर सकता हूं। कृपया कोई product या shopping category पूछें।'
    : 'Sorry, I am a shopbot. I can only help with shopping queries.'
);

export const getHistory = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const conversation = await Conversation.findOne({ sessionId });
    if (!conversation) {
      return res.json({ sessionId, conversation: null, messages: [] });
    }

    const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });
    const enrichedMessages = messages.map((msg) => {
      const plain = msg.toObject();
      return {
        ...plain,
        products: ensureMarketplaceCoverage(plain.products || [], plain.content || '')
      };
    });

    res.json({
      sessionId,
      conversation,
      messages: enrichedMessages
    });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { sessionId, message, language = 'en' } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ message: 'sessionId and message are required' });
    }

    let conversation = await Conversation.findOne({ sessionId });
    if (!conversation) {
      conversation = await Conversation.create({
        sessionId,
        title: message.slice(0, 48),
        language
      });
    }

    const userMessage = await Message.create({
      conversationId: conversation._id,
      role: 'user',
      content: message,
      messageType: 'text'
    });

    const shoppingIntent = isShoppingQuery(message);
    const history = [];

    if (!shoppingIntent) {
      const reply = shoppingOnlyReply(language);

      const assistantMessage = await Message.create({
        conversationId: conversation._id,
        role: 'assistant',
        content: reply,
        messageType: 'shopping-only',
        products: [],
        metadata: { shoppingIntent: false, hasProducts: false }
      });

      conversation.lastMessageAt = new Date();
      if (conversation.title === 'New conversation' || !conversation.title) {
        conversation.title = message.slice(0, 48);
      }
      conversation.language = language;
      await conversation.save();

      return res.json({
        sessionId,
        conversationId: conversation._id,
        userMessage,
        assistantMessage,
        products: [],
        reply
      });
    }

    const products = ensureMarketplaceCoverage(await searchProducts(message), message);
    const hasProducts = Array.isArray(products) && products.length > 0;
    const reply = await generateReply({ message, history, language, products });

    const assistantMessage = await Message.create({
      conversationId: conversation._id,
      role: 'assistant',
      content: reply,
      messageType: 'shopping',
      products,
      metadata: { shoppingIntent, hasProducts }
    });

    conversation.lastMessageAt = new Date();
    if (conversation.title === 'New conversation' || !conversation.title) {
      conversation.title = message.slice(0, 48);
    }
    conversation.language = language;
    await conversation.save();

    res.json({
      sessionId,
      conversationId: conversation._id,
      userMessage,
      assistantMessage,
      products,
      reply
    });
  } catch (error) {
    next(error);
  }
};
