import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ChatInterface from '../components/ChatInterface';

const ChatPage = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userMessage = { role: 'user', content: question.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/query/', {
        document_id: parseInt(id),
        question: userMessage.content,
      });

      const aiMessage = {
        role: 'ai',
        content: res.data.answer,
        sources: res.data.sources || [],
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: 'ai', content: '❌ Error: Failed to get answer.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">💬 Chat with Document #{id}</h1>
      <ChatInterface
        messages={messages}
        loading={loading}
        question={question}
        setQuestion={setQuestion}
        handleAsk={handleAsk}
      />
    </div>
  );
};

export default ChatPage;
