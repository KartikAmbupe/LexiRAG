import React, { useRef, useEffect } from 'react';
import { Bot, User } from 'lucide-react';

const ChatInterface = ({ messages, loading, question, setQuestion, handleAsk }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <div className="flex-1 overflow-y-auto max-h-[60vh] bg-[#1F2937] rounded-2xl shadow p-6 space-y-4 mb-2" style={{ maxHeight: 'calc(100vh - 240px)' }}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="flex items-start gap-2 max-w-sm">
              {msg.role === 'ai' && (
                <div className="text-purple-400 mt-1">
                  <Bot className="w-5 h-5" />
                </div>
              )}
              <div
                className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap shadow ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white'
                    : 'bg-[#2D3748] text-white border border-gray-700'
                }`}
              >
                {msg.content}
                {/* {msg.sources && msg.sources.length > 0 && (
                  <ul className="mt-2 text-xs text-purple-300 list-disc pl-5">
                    {msg.sources.map((src, i) => <li key={i}>{src}</li>)}
                  </ul>
                )} */}
              </div>
              {msg.role === 'user' && (
                <div className="text-gray-300 mt-1">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="sticky bottom-0 bg-[#0B1120] pb-4 z-10">
        <div className="flex gap-2 items-center mt-2">
          <input
            type="text"
            className="flex-1 bg-[#1E293B] text-white border border-gray-600 px-4 py-3 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm placeholder-gray-400"
            placeholder="Ask something about the document..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          />
          <button
            onClick={handleAsk}
            disabled={loading}
            className="
              px-6 py-3 rounded-full
              bg-gradient-to-r from-purple-600 via-pink-600 to-red-600
              text-white font-semibold shadow-md
              hover:from-purple-700 hover:via-pink-700 hover:to-red-700
              focus:outline-none focus:ring-4 focus:ring-purple-500/60
              transition-all duration-300
            "
          >
            {loading ? 'Asking...' : 'Ask'}
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatInterface;
