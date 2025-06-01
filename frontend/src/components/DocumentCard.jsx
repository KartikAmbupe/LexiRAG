import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const DocumentCard = ({ doc }) => {
  return (
    <div
      className="rounded-2xl p-[3px] bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 transition hover:scale-105 hover:shadow-2xl"
    >
      <Card className="bg-[#1c1f2e] text-gray-100 rounded-2xl h-full">
        <CardContent className="p-6 flex flex-col justify-between h-full">
          <div>
            <h2 className="text-xl font-bold truncate mb-2">{doc.title}</h2>
            <p className="text-sm text-gray-400">
              📄 {doc.doc_type.toUpperCase()} • {(doc.size / 1024).toFixed(1)} KB
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Uploaded: {new Date(doc.upload_date).toLocaleString()}
            </p>
          </div>

          <Link
            to={`/chat/${doc.id}`}
            className="
              mt-6 inline-block text-center px-6 py-2 rounded-full
              bg-gradient-to-r from-purple-600 via-pink-600 to-red-600
              text-white font-medium text-sm
              hover:from-purple-700 hover:via-pink-700 hover:to-red-700
              focus:outline-none focus:ring-2 focus:ring-purple-500/60
              transition-all duration-300
            "
          >
            Chat →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentCard;
