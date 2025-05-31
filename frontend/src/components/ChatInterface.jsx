// src/components/ChatInterface.jsx
import React, { useRef, useEffect } from 'react';

const ChatInterface = ({ messages, loading, question, setQuestion, handleAsk }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <div className="flex-1 overflow-y-auto bg-white rounded shadow p-4 space-y-4 mb-4 max-h-[70vh]">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg px-4 py-2 max-w-sm whitespace-pre-wrap text-sm ${
              msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}>
              {msg.content}
              {msg.sources && msg.sources.length > 0 && (
                <ul className="mt-2 text-xs text-gray-600 list-disc pl-5">
                  {msg.sources.map((src, i) => <li key={i}>{src}</li>)}
                </ul>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border px-4 py-2 rounded"
          placeholder="Ask something about the document..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
        />
        <button
          onClick={handleAsk}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Asking...' : 'Ask'}
        </button>
      </div>
    </>
  );
};

export default ChatInterface;
