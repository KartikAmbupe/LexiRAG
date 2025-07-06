import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useUser } from "@clerk/clerk-react";

const UploadForm = () => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState('');
  const [documentId, setDocumentId] = useState(null);
  const {user} = useUser();
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setStatus('Uploading...');
    setDocumentId(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/documents/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          "X-User-Id": user?.id,
        },
        validateStatus: (status) => status >= 200 && status < 300,
      });

      if (res.status === 201) {
        setStatus(`✅ Successfully uploaded: ${res.data.title}`);
        setDocumentId(res.data.id);
      } else {
        setStatus(`⚠️ Server responded with ${res.status}: ${res.data?.error || 'Upload failed'}`);
      }
    } catch (error) {
      console.error("Upload error:", error.message);
      setStatus('Upload failed. See console for details.');
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 p-8 rounded-xl shadow-lg w-full max-w-md mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-center">📎 Upload a Document</h1>

      <p className="text-center text-gray-400 mb-6 max-w-sm mx-auto">
        Select a PDF, DOCX, or TXT file to upload. Once uploaded, you can chat with your document using LexiRAG’s intelligent retrieval system.
      </p>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => fileInputRef.current.click()}
          className="
            px-8 py-3 rounded-full
            bg-gradient-to-r from-purple-600 via-pink-600 to-red-600
            text-white font-semibold
            shadow-md
            hover:from-purple-700 hover:via-pink-700 hover:to-red-700
            focus:outline-none focus:ring-4 focus:ring-purple-500/60
            transition-all duration-300
            cursor-pointer
          "
        >
          Choose File
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {fileName && (
        <p className="text-center text-gray-300 mb-4">
          Selected file: <span className="font-semibold">{fileName}</span>
        </p>
      )}

      {status && (
        <div
          className={`text-center text-sm font-medium ${
            status.startsWith('✅')
              ? 'text-green-400'
              : status.startsWith('❌') || status.startsWith('⚠️')
              ? 'text-red-400'
              : 'text-yellow-400'
          }`}
        >
          {status}
        </div>
      )}

      {documentId && (
        <div className="mt-6 text-center">
          <a
            href={`/chat/${documentId}`}
            className="inline-block px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold transition"
          >
            💬 Chat
          </a>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
