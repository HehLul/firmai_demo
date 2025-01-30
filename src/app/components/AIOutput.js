// components/AIOutput.js
import ReactMarkdown from 'react-markdown';

const AIOutput = ({ output, isLoading, error }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl mb-4 text-gray-700">PE Analysis</h2>
      
      {isLoading && (
        <div className="text-blue-600 animate-pulse">
          Analyzing investment memorandum...
        </div>
      )}
      
      {error && (
        <div className="text-red-600">
          {error}
        </div>
      )}
      
      {output && output.analysis && !isLoading && (
        <div className="prose max-w-none">
          <ReactMarkdown className="whitespace-pre-wrap">
            {output.analysis}
          </ReactMarkdown>
        </div>
      )}
      
      {!output && !isLoading && !error && (
        <div className="text-gray-500">
          Upload an investment memorandum for PE analysis
        </div>
      )}
    </div>
  );
};

export default AIOutput;