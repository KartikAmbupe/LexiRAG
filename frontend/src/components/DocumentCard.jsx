// src/components/DocumentCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const DocumentCard = ({ doc }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition">
      <h2 className="text-lg font-semibold text-gray-800 truncate">{doc.title}</h2>
      <p className="text-sm text-gray-600">
        📄 {doc.doc_type.toUpperCase()} • {(doc.size / 1024).toFixed(1)} KB
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Uploaded: {new Date(doc.upload_date).toLocaleString()}
      </p>
      <p
        className={`text-sm mt-2 font-medium ${
          doc.processing_status.startsWith("Completed")
            ? "text-green-600"
            : doc.processing_status.startsWith("Error")
            ? "text-red-600"
            : "text-yellow-600"
        }`}
      >
        {doc.processing_status}
      </p>
      <Link
        to={`/chat/${doc.id}`}
        className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
      >
        Chat →
      </Link>
    </div>
  );
};

export default DocumentCard;
