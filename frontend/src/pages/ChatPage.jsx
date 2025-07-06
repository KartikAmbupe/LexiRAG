import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ChatInterface from '../components/ChatInterface';
import { useUser } from '@clerk/clerk-react'

const ChatPage = () => {
  const { id } = useParams(); // document id from url
  const { user } = useUser(); //clerk user
  const [chatSessionId, setChatSessionId] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [documentUploadDate, setDocumentUploadDate] = useState('');


  useEffect(() => {
    const fetchData = async () => {
      try{
        const headers = {
          "X-User-Id":user.id,
        };

      // Fetch Documetn metadata
      const docRes = await axios.get(`http://127.0.0.1:8000/api/documents/${id}/`, {headers});
      setDocumentName(docRes.data.title);
      setDocumentUploadDate(docRes.data.upload_date);

      // Fetch chat history
      const chatRes = await axios.get(`http://127.0.0.1:8000/api/chat-history/${id}/`, {headers});

      // set existing message
      const restoredMessages = chatRes.data.messages.map(msg => ({
        role: msg.is_user ? 'user' : 'ai',
        content: msg.content,
        sources: msg.sources?.split('\n\n') || [],
      }));
      
      setMessages(restoredMessages);
      setChatSessionId(chatRes.data.chat_session_id);

    } catch (error) {
      console.error('Error loading chat data:', error);
      setDocumentName('LexiRAG');
    }
  };

    if(user?.id) fetchData();
  }, [id, user]);

  //asking a new question
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
        chat_session_id: chatSessionId,
      },
      {
        headers: {
          "X-User-Id": user.id,
        }
      });

      const aiMessage = {
        role: 'ai',
        content: res.data.answer,
        sources: res.data.sources || [],
      };

      setMessages((prev) => [...prev, aiMessage]);
      
      if(!chatSessionId){
        setChatSessionId(res.data.chat_session_id);
      }

    } catch (err) {
      console.error("Ask failed", err);
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
    <div className="flex flex-col h-full bg-[#0B1120] p-6 text-white overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
          💬 Chat with <span className="text-purple-400">{documentName}</span>
          </h1>
          <p className="text-sm text-gray-400">
            Uploaded on: {documentUploadDate ? new Date(documentUploadDate).toLocaleString() : "Loading..."}
          </p>
        </div>
        <button
        onClick={async () => {
          try {
            await axios.delete(`http://127.0.0.1:8000/api/chat-history/${id}/clear/`, {
              headers: { "X-User-Id": user.id },
            });
            setMessages([]);
            setChatSessionId(null);
          } catch (err) {
            console.error("Failed to clear chat:", err);
          }
        }}
        className="self-end mb-4 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-sm"
      >
        🗑️ Clear Chat
      </button>
      </div>
      
      <div className="flex flex-col flex-1 max-h-[calc(100vh-140px)] overflow-hidden">
        <ChatInterface
          messages={messages}
          loading={loading}
          question={question}
          setQuestion={setQuestion}
          handleAsk={handleAsk}
        />
      </div>
    </div>
  );
};

export default ChatPage;
