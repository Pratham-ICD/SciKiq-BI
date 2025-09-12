'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Truck,
  Users,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Finance', href: '/finance', icon: DollarSign, current: true },
  {
    name: 'Order Journey',
    href: '/order-journey',
    icon: ShoppingCart,
    current: false,
  },
  { name: 'Marketing', href: '/marketing', icon: TrendingUp, current: false },
  { name: 'Supply Chain', href: '/supply-chain', icon: Truck, current: false },
  { name: 'HR Analytics', href: '/hr', icon: Users, current: false },
];

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const pathname = usePathname();

  return (
    <div className='flex h-screen bg-gray-50 dark:bg-gray-900'>
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-40 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        >
          <div className='absolute inset-0 bg-gray-600 opacity-75' />
        </div>
      )}

      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          // Mobile behavior
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop width based on collapsed state
          sidebarCollapsed ? 'lg:w-20' : 'lg:w-72',
          // Mobile width
          'w-72'
        )}
      >
        <div className='flex flex-col h-full'>
          {/* Logo/Header */}
          <div className='flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700'>
            <div
              className={cn(
                'flex items-center transition-all duration-300',
                sidebarCollapsed
                  ? 'lg:justify-center lg:space-x-0'
                  : 'space-x-3'
              )}
            >
              <img
                src='/ScikiQOG.png'
                alt='Scikiq Logo'
                className='w-7 h-7 object-contain'
              />
              <div
                className={cn(
                  'transition-all duration-300',
                  sidebarCollapsed ? 'lg:hidden' : 'block'
                )}
              >
                <h1 className='text-lg font-bold text-gray-900 dark:text-white'>
                  Scikiq
                </h1>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  Business Intelligence
                </p>
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              {/* Desktop collapse button */}
              <Button
                variant='ghost'
                size='sm'
                className='hidden lg:flex'
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className='h-5 w-5' />
                ) : (
                  <ChevronLeft className='h-5 w-5' />
                )}
              </Button>
              {/* Mobile close button */}
              <Button
                variant='ghost'
                size='sm'
                className='lg:hidden'
                onClick={() => setSidebarOpen(false)}
              >
                <X className='h-5 w-5' />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className='flex-1 px-4 py-6 space-y-2'>
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center text-sm font-medium rounded-lg transition-all duration-200 group relative',
                    sidebarCollapsed
                      ? 'lg:justify-center lg:px-3 lg:py-3'
                      : 'px-4 py-3',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  )}
                  onClick={() => setSidebarOpen(false)}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <item.icon
                    className={cn(
                      'h-5 w-5 transition-all duration-200',
                      sidebarCollapsed ? 'lg:mr-0' : 'mr-3',
                      isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-400'
                    )}
                  />
                  <span
                    className={cn(
                      'transition-all duration-300',
                      sidebarCollapsed ? 'lg:hidden' : 'block'
                    )}
                  >
                    {item.name}
                  </span>
                  {isActive && !sidebarCollapsed && (
                    <div className='ml-auto'>
                      <div className='w-2 h-2 bg-blue-600 rounded-full' />
                    </div>
                  )}
                  {isActive && sidebarCollapsed && (
                    <div className='absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden lg:block whitespace-nowrap z-50'>
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
            <div
              className={cn(
                'flex items-center transition-all duration-300',
                sidebarCollapsed
                  ? 'lg:justify-center lg:space-x-0'
                  : 'space-x-3'
              )}
            >
              <div className='w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center'>
                <BarChart3 className='w-4 h-4 text-gray-600' />
              </div>
              <div
                className={cn(
                  'flex-1 transition-all duration-300',
                  sidebarCollapsed ? 'lg:hidden' : 'block'
                )}
              >
                <p className='text-sm font-medium text-gray-900 dark:text-white'>
                  Demo Mode
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Top bar */}
        <header className='bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700'>
          <div className='flex items-center justify-between h-16 px-6'>
            {/* Mobile menu button */}
            <Button
              variant='ghost'
              size='sm'
              className='lg:hidden'
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className='h-5 w-5' />
            </Button>

            <div className='flex items-center space-x-4 ml-auto'>
              <div className='text-sm text-gray-500 dark:text-gray-400'>
                Last updated: {new Date().toLocaleTimeString()}
              </div>
              <div
                className='w-2 h-2 bg-green-500 rounded-full animate-pulse'
                title='Live data'
              />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className='flex-1 overflow-auto'>{children}</main>
      </div>
    </div>
  );
}
