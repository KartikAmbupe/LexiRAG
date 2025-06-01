import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0c0f1a] text-white flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4 flex items-center justify-center gap-2">
          <span role="img" aria-label="bot">🤖</span> Welcome to <span className="text-pink-500">LexiRAG</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mx-auto">
          Upload your documents and chat with them using intelligent Retrieval-Augmented Generation.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Upload Card */}
        <div
          onClick={() => navigate("/upload")}
          className="rounded-2xl p-[3px] bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 cursor-pointer transition-transform hover:scale-105"
        >
          <Card className="bg-[#1c1f2e] rounded-2xl h-full">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                📤 Upload Document
              </h2>
              <p className="text-gray-400">
                Upload a document to start chatting with it.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Library Card */}
        <div
          onClick={() => navigate("/library")}
          className="rounded-2xl p-[3px] bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 cursor-pointer transition-transform hover:scale-105"
        >
          <Card className="bg-[#1c1f2e] rounded-2xl h-full">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                📁 Document Library
              </h2>
              <p className="text-gray-400">
                Select from your uploaded documents and start chatting with any of them.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
