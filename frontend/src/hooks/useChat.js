import { useEffect, useState } from 'react';
import api from '../services/api.js';

export const useChat = (sessionId, language = 'en') => {
  const [messages, setMessages] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHistory = async () => {
      if (!sessionId) return;
      setHistoryLoading(true);
      try {
        const response = await api.get(`/chat/history/${sessionId}`);
        const historyMessages = response.data?.messages || [];
        const normalizedMessages = historyMessages.map((item) => ({
          id: item._id,
          role: item.role,
          content: item.content,
          products: item.products || []
        }));
        setMessages(normalizedMessages);
        const lastAssistant = [...historyMessages].reverse().find((item) => item.role === 'assistant');
        setProducts(lastAssistant?.products || []);
      } catch (fetchError) {
        setError('Unable to load chat history.');
      } finally {
        setHistoryLoading(false);
      }
    };

    loadHistory();
  }, [sessionId]);

  const sendMessage = async (content) => {
    if (!content.trim() || !sessionId) return null;

    const userMessage = {
      id: `local-user-${Date.now()}`,
      role: 'user',
      content,
      products: []
    };

    setMessages((current) => [...current, userMessage]);
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/chat/message', {
        sessionId,
        message: content,
        language
      });

      const assistant = response.data?.assistantMessage || {
        _id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.data?.reply || 'No response received.',
        products: response.data?.products || []
      };

      const assistantMessage = {
        id: assistant._id || `assistant-${Date.now()}`,
        role: 'assistant',
        content: assistant.content,
        products: assistant.products || []
      };

      setMessages((current) => [...current, assistantMessage]);
      setProducts(assistantMessage.products);
      return response.data;
    } catch (sendError) {
      const errorMessage = 'I could not reach the AI service. Please try again.';
      setMessages((current) => [
        ...current,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: errorMessage,
          products: []
        }
      ]);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    products,
    loading,
    historyLoading,
    error,
    setMessages,
    setProducts,
    sendMessage
  };
};
