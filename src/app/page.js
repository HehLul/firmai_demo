'use client';
import { useState } from 'react';
import FileUploader from './components/FileUploader';
import AIOutput from './components/AIOutput';

export default function Home() {
  const [pdfFile, setPdfFile] = useState(null);
  const [aiOutput, setAiOutput] = useState('');

  const handleFileUpload = (file) => {
    setPdfFile(file);
    // TODO: Implement PDF processing logic
  };

  return (
    <main className="min-h-screen p-24 bg-gray-100">
      <div className="container mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">
            PE Firm PDF Analyzer
          </h1>
        </header>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <FileUploader onFileUpload={handleFileUpload} />
          </div>
          
          <div>
            <AIOutput output={aiOutput} />
          </div>
        </div>
      </div>
    </main>
  );
}