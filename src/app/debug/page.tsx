'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function DebugPage() {
  const [initData, setInitData] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const { authenticate, isAuthenticated, error } = useAuth();

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  const handleAuthenticate = async () => {
    addLog(`Starting authentication with initData: ${initData}`);
    const result = await authenticate(initData);
    addLog(`Authentication result: ${result}`);
  };

  useEffect(() => {
    // Try to get initData from URL
    const urlParams = new URLSearchParams(window.location.search);
    const initDataFromUrl = urlParams.get('initData');
    if (initDataFromUrl) {
      setInitData(initDataFromUrl);
      addLog(`Found initData in URL: ${initDataFromUrl}`);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Debug Page</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-800 p-4 rounded">
              <p className="text-sm text-gray-400">Authentication Status</p>
              <p className={isAuthenticated ? 'text-green-500' : 'text-red-500'}>
                {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <p className="text-sm text-gray-400">Error</p>
              <p className="text-red-500">{error || 'None'}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Authentication</h2>
          <div className="flex gap-4 mb-4">
            <textarea
              value={initData}
              onChange={(e) => setInitData(e.target.value)}
              placeholder="Paste initData here..."
              className="flex-1 bg-gray-800 text-white p-4 rounded"
              rows={4}
            />
            <button
              onClick={handleAuthenticate}
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-colors h-fit"
            >
              Authenticate
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
          <div className="bg-gray-800 p-4 rounded">
            {logs.map((log, index) => (
              <p key={index} className="font-mono text-sm mb-1">{log}</p>
            ))}
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-400">
          <h3 className="font-semibold mb-2">How to test:</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Open your app in Telegram</li>
            <li>Check browser console for initData</li>
            <li>Copy the initData value</li>
            <li>Paste it here and click Authenticate</li>
            <li>Check the logs for results</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 