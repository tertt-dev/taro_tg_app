'use client';

import { useEffect, useState } from 'react';
import { useTelegramWebApp } from '@/components/TelegramProvider';

export default function DebugPage() {
  const { webApp, ready, error, isAuthenticated } = useTelegramWebApp();
  const [initData, setInitData] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      setInitData(urlParams.get('initData') || '');
    }
  }, []);

  useEffect(() => {
    const addLog = (message: string) => {
      setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
    };

    addLog(`Ready: ${ready}`);
    addLog(`WebApp available: ${!!webApp}`);
    if (webApp) {
      addLog(`Platform: ${webApp.platform}`);
      addLog(`Version: ${webApp.version}`);
      addLog(`InitData: ${webApp.initData}`);
      addLog(`User: ${JSON.stringify(webApp.initDataUnsafe.user, null, 2)}`);
    }
    if (error) {
      addLog(`Error: ${error}`);
    }
    addLog(`Authenticated: ${isAuthenticated}`);
  }, [ready, webApp, error, isAuthenticated]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Info</h1>
        
        <div className="space-y-6">
          <div className="bg-white/5 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
            <div className="space-y-2">
              <p>Ready: <span className={ready ? 'text-green-500' : 'text-red-500'}>{ready ? 'Yes' : 'No'}</span></p>
              <p>Authenticated: <span className={isAuthenticated ? 'text-green-500' : 'text-red-500'}>{isAuthenticated ? 'Yes' : 'No'}</span></p>
              <p>Error: <span className="text-red-500">{error || 'None'}</span></p>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">WebApp Status</h2>
            <div className="space-y-2">
              <p>WebApp Available: <span className={webApp ? 'text-green-500' : 'text-red-500'}>{webApp ? 'Yes' : 'No'}</span></p>
              <p>Platform: <span className="text-gray-400">{webApp?.platform || 'Unknown'}</span></p>
              <p>Version: <span className="text-gray-400">{webApp?.version || 'Unknown'}</span></p>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">User Data</h2>
            <div className="space-y-2">
              {webApp?.initDataUnsafe?.user ? (
                <>
                  <p>ID: <span className="text-gray-400">{webApp.initDataUnsafe.user.id}</span></p>
                  <p>Name: <span className="text-gray-400">{webApp.initDataUnsafe.user.first_name} {webApp.initDataUnsafe.user.last_name}</span></p>
                  <p>Username: <span className="text-gray-400">@{webApp.initDataUnsafe.user.username || 'none'}</span></p>
                </>
              ) : (
                <p className="text-red-500">No user data available</p>
              )}
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Init Data</h2>
            <div className="space-y-2">
              <p className="text-sm font-medium">From URL:</p>
              <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-xs">
                {initData || 'No initData in URL'}
              </pre>
              <p className="text-sm font-medium mt-4">From WebApp:</p>
              <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-xs">
                {webApp?.initData || 'No WebApp initData'}
              </pre>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
            <div className="space-y-2">
              {logs.map((log, index) => (
                <pre key={index} className="bg-black/50 p-2 rounded text-xs font-mono">
                  {log}
                </pre>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 