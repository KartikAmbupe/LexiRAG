import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DocumentCard from '../components/DocumentCard';
import { useUser } from "@clerk/clerk-react";

const LibraryPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if(!user) return;
    axios.get('http://127.0.0.1:8000/api/documents/', {
      headers: {
        "X-User-Id": user.id,
      },
    })
      .then(res => {
        setDocuments(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load documents:", err);
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-4xl font-bold text-center text-gray-100 mb-8">📁 Document Library</h1>

      {loading ? (
        <p className="text-center text-gray-400">Loading documents...</p>
      ) : documents.length === 0 ? (
        <p className="text-center text-gray-500">No documents uploaded yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {documents.map(doc => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
