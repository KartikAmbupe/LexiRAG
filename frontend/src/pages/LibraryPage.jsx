// src/pages/LibraryPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DocumentCard from '../components/DocumentCard'; // 👈 import the card

const LibraryPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔄 Fetching documents...");
    axios.get('http://127.0.0.1:8000/api/documents/')
      .then(res => {
        console.log("✅ Documents loaded:", res.data);
        setDocuments(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ Failed to load documents:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">📁 Document Library</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading documents...</p>
      ) : documents.length === 0 ? (
        <p className="text-center text-gray-500">No documents uploaded yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map(doc => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
