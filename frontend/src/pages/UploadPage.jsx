import React from 'react';
import UploadForm from '../components/UploadForm';

const UploadPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-6 text-white">
      <div className="w-full max-w-md p-1 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 shadow-xl">
        <UploadForm />
      </div>
    </div>
  );
};

export default UploadPage;
