'use client';

import { useTelegram } from '@/components/TelegramProvider';

export default function DebugPage() {
  const { webApp, ready, error, isAuthenticated } = useTelegram();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Отладка</h1>
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold mb-2">Состояние WebApp:</h2>
            <pre className="bg-gray-800 p-4 rounded">
              {JSON.stringify(
                {
                  webAppAvailable: !!webApp,
                  ready,
                  error,
                  isAuthenticated,
                  initData: webApp?.initDataUnsafe,
                  platform: webApp?.platform,
                  viewportHeight: webApp?.viewportHeight,
                  viewportStableHeight: webApp?.viewportStableHeight,
                  isExpanded: webApp?.isExpanded,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 