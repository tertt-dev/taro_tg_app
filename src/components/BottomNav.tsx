'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Clock, LayoutGrid, User } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  {
    name: 'Главная',
    icon: Home,
    path: '/',
    testPath: '/test'
  },
  {
    name: 'История',
    icon: Clock,
    path: '/history',
    testPath: '/test/history'
  },
  {
    name: 'Колода',
    icon: LayoutGrid,
    path: '/deck',
    testPath: '/test/deck'
  },
  {
    name: 'Профиль',
    icon: User,
    path: '/profile',
    testPath: '/test/profile'
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const isTestMode = pathname?.startsWith('/test');

  const handleNavigation = (item: typeof navItems[0]) => {
    const targetPath = isTestMode ? item.testPath : item.path;
    router.push(targetPath);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0">
      <div className="mx-auto max-w-lg">
        <div className="flex justify-around items-center bg-black/80 backdrop-blur-md border-t border-white/10 px-4 py-3">
          {navItems.map((item) => {
            const isActive = isTestMode 
              ? pathname === item.testPath
              : pathname === item.path;

            return (
              <motion.button
                key={item.path}
                onClick={() => handleNavigation(item)}
                className={`flex flex-col items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive ? 'text-white' : 'text-white/40 hover:text-white/80'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="w-7 h-7" />
                <span className="text-sm font-medium font-cormorant">{item.name}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
} 