// src/pages/UploadPage.jsx
import React from 'react';
import UploadForm from '../components/UploadForm'; // 👈 import the component

const UploadPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6">
      <UploadForm />
    </div>
  );
};

export default UploadPage;
