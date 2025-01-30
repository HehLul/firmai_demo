const AIOutput = ({ output }) => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md min-h-[300px]">
        <h2 className="text-2xl mb-4 text-gray-700">AI Analysis</h2>
        {output ? (
          <div className="text-gray-600">{output}</div>
        ) : (
          <p className="text-gray-400">
            Upload a PDF to see AI-powered analysis
          </p>
        )}
      </div>
    );
  };
  
  export default AIOutput;