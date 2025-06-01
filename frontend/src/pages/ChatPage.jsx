import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ChatInterface from '../components/ChatInterface';

const ChatPage = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [documentName, setDocumentName] = useState('');

  useEffect(() => {
    const fetchDocumentName = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/document/${id}/`);
        setDocumentName(res.data.title);
      } catch (error) {
        console.error('Error fetching document name:', error);
        setDocumentName(`LexiRAG`);
      }
    };

    fetchDocumentName();
  }, [id]);

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
      setMessages((prev) => [...prev, {
        role: 'ai',
        content: '❌ Error: Failed to get answer.',
        sources: [],
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1120] p-6 text-white">
      <h1 className="text-3xl font-extrabold mb-6 text-white">
        💬 Chat with <span className="text-purple-400">{documentName}</span>
      </h1>
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
