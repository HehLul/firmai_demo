// components/FileUploader.js
import { useState } from 'react';

const FileUploader = ({ onFileUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      onFileUpload(file);
    } else {
      alert('Please upload a PDF file');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl mb-4 text-gray-700">Upload PDF</h2>
      <input 
        type="file" 
        accept=".pdf"
        onChange={handleFileChange}
        className="block w-full text-sm text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
      />
      {selectedFile && (
        <p className="mt-2 text-sm text-green-600">
          {selectedFile.name} selected
        </p>
      )}
    </div>
  );
};

export default FileUploader;