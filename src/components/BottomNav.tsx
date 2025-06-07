'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Clock, LayoutGrid, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    name: 'Главная',
    icon: Home,
    path: '/',
  },
  {
    name: 'История',
    icon: Clock,
    path: '/history',
  },
  {
    name: 'Колода',
    icon: LayoutGrid,
    path: '/deck',
  },
  {
    name: 'Профиль',
    icon: User,
    path: '/profile',
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-lg">
        <div className="flex justify-around items-center bg-black/40 backdrop-blur-md border-t border-white/10 px-4 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.path)}
                className={cn(
                  'flex flex-col items-center justify-center min-w-[64px] py-1 px-2 rounded-lg transition-all duration-200',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                )}
              >
                <item.icon className={cn(
                  'w-6 h-6 transition-transform',
                  isActive && 'scale-110'
                )} />
                <span className="text-xs mt-1">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
} 