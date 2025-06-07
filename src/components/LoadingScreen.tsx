'use client';

import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowError(true);
    }, 10000); // Show error message after 10 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-white text-center">
        <div className="mb-4">
          <svg
            className="animate-spin h-10 w-10 text-purple-500 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <p className="text-lg mb-2">Загрузка...</p>
        {showError && (
          <div className="mt-4 text-red-400 max-w-sm mx-auto">
            <p className="text-sm">
              Загрузка занимает больше времени, чем обычно. Пожалуйста:
            </p>
            <ul className="text-sm mt-2 text-left list-disc pl-4">
              <li>Убедитесь, что вы открыли приложение через Telegram</li>
              <li>Проверьте ваше интернет-соединение</li>
              <li>Попробуйте обновить страницу</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 