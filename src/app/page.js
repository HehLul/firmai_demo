// app/page.js
'use client';
import { useState } from 'react';
import FileUploader from './components/FileUploader';
import AIOutput from './components/AIOutput';

export default function Home() {
  const [pdfFile, setPdfFile] = useState(null);
  const [aiOutput, setAiOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (file) => {
    try {
      // Clear previous results
      setAiOutput(null);
      setError(null);
      setIsLoading(true);
      
      // Update current file
      setPdfFile(file);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/process-pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to process PDF');
      }

      // Set new results
      setAiOutput(data);
      
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
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
            {/* Key prop forces re-render when file changes */}
            <AIOutput 
              key={pdfFile ? pdfFile.name : 'no-file'}
              output={aiOutput} 
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </div>
    </main>
  );
}