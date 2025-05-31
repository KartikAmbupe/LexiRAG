// src/components/UploadForm.jsx
import React, { useRef, useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setStatus('Uploading...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/documents/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        validateStatus: (status) => status >= 200 && status < 300,
      });

      console.log("🔁 Upload response:", res);

      if (res.status === 201) {
        setStatus(`✅ Successfully uploaded: ${res.data.title}`);
      } else {
        setStatus(`⚠️ Server responded with ${res.status}: ${res.data?.error || 'Upload failed'}`);
      }
    } catch (error) {
      console.error("❌ Upload error:", error.message);
      console.error("🔍 Response:", error.response);
      setStatus('❌ Upload failed. See console for details.');
    }
  };

  return (
    <div className="bg-white text-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
      <h1 className="text-2xl font-bold mb-4 text-center">📎 Upload a Document</h1>

      <div className="flex justify-center mb-4">
        <button
          onClick={() => fileInputRef.current.click()}
          className="text-3xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition"
          title="Click to select a file"
        >
          📎
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
        <p className="text-sm text-center text-gray-600 mb-2">
          Selected: <span className="font-medium">{fileName}</span>
        </p>
      )}

      {status && (
        <div className="text-center mt-2 text-sm font-medium">
          {status}
        </div>
      )}
    </div>
  );
};

export default UploadForm;
