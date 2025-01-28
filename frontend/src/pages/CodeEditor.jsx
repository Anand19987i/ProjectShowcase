import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import Navbar from './Navbar';
import { PROJECT_API_END_POINT } from '@/utils/constant';

const CodeEditor = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('python');
  const [isLoading, setIsLoading] = useState(false);

  const languageConfig = {
    python: { defaultCode: '#code here', extension: 'py' },
    java: {
      defaultCode: `public class Main {
    public static void main(String[] args) {
        // Your code here
    }
}`,
      extension: 'java',
    },
    cpp: {
      defaultCode: `#include <iostream>
using namespace std;

int main() {
    // Your code here
    return 0;
}`,
      extension: 'cpp',
    },
  };

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const runCode = async () => {
    setIsLoading(true);
    setOutput('');

    try {
      const response = await axios.post(
        `${PROJECT_API_END_POINT}/execute`,
        {
          code,
          language,
        },
        { withCredentials: true }
      );

      setOutput(response.data.output || 'No output');
    } catch (error) {
      console.error('Error executing code:', error);
      setOutput(
        error.response?.data?.error ||
          'An error occurred while executing the code.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Code Editor</h1>

          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setCode(languageConfig[e.target.value].defaultCode);
              }}
              className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>

            <button
              onClick={runCode}
              disabled={isLoading}
              className={`px-6 py-2 rounded-lg text-white font-semibold shadow-lg transition-all duration-200 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Running...' : 'Run Code'}
            </button>
          </div>

          <div className="h-96 border rounded-lg overflow-hidden mb-6">
            <Editor
              height="100%"
              language={language}
              value={code || languageConfig[language].defaultCode}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Output:</h3>
            <pre
              className="bg-gray-50 text-gray-800 rounded-lg p-4 border border-gray-300 whitespace-pre-wrap overflow-x-auto"
            >
              {output || 'No output yet.'}
            </pre>
          </div>
        </div>
      </div>
    </>
  );
};

export default CodeEditor;
