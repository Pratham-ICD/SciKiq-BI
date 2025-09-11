'use client';

import { Bell } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  time: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: 1,
    title: 'Cash Flow Alert',
    message: 'Operating cash flow increased by 15% this month',
    type: 'success',
    time: '5 min ago',
    read: false,
  },
  {
    id: 2,
    title: 'AR Overdue',
    message: 'Global Industries payment is 65 days overdue ($95,000)',
    type: 'warning',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 3,
    title: 'Revenue Target',
    message: 'Monthly revenue target achieved - 126.7% of goal',
    type: 'success',
    time: '2 hours ago',
    read: true,
  },
  {
    id: 4,
    title: 'Working Capital',
    message: 'Working capital increased to $380K (+5.7% vs last month)',
    type: 'info',
    time: '4 hours ago',
    read: true,
  },
  {
    id: 5,
    title: 'Payment Due',
    message: 'Material Supplier D payment due in 2 days ($67,000)',
    type: 'warning',
    time: '6 hours ago',
    read: false,
  },
];

export default function Header({ title, subtitle }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  return (
    <header className='bg-white border-b border-gray-200 shadow-sm'>
      <div className='px-6 py-4'>
        <div className='flex items-center justify-between'>
          {/* Page Title */}
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>{title}</h1>
            {subtitle && (
              <p className='text-sm text-gray-600 mt-1'>{subtitle}</p>
            )}
          </div>

          {/* Header Actions */}
          <div className='flex items-center space-x-4'>
            {/* Notifications */}
            <div className='relative'>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className='relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors'
              >
                <Bell className='h-5 w-5' />
                {unreadCount > 0 && (
                  <span className='absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-400 text-xs text-white font-bold flex items-center justify-center'>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className='absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50'>
                  <div className='p-4 border-b border-gray-200'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      Notifications
                    </h3>
                    <p className='text-sm text-gray-500'>
                      {unreadCount} unread notifications
                    </p>
                  </div>
                  <div className='max-h-96 overflow-y-auto'>
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className='flex items-start space-x-3'>
                          <span className='text-lg flex-shrink-0 mt-0.5'>
                            {getNotificationIcon(notification.type)}
                          </span>
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-center justify-between'>
                              <p
                                className={`text-sm font-medium text-gray-900 ${
                                  !notification.read ? 'font-semibold' : ''
                                }`}
                              >
                                {notification.title}
                              </p>
                              <span className='text-xs text-gray-500'>
                                {notification.time}
                              </span>
                            </div>
                            <p className='text-sm text-gray-600 mt-1'>
                              {notification.message}
                            </p>
                            {!notification.read && (
                              <div className='w-2 h-2 bg-blue-500 rounded-full mt-2'></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className='p-3 border-t border-gray-200'>
                    <button className='w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium'>
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close notifications */}
      {showNotifications && (
        <div
          className='fixed inset-0 z-40'
          onClick={() => setShowNotifications(false)}
        />
      )}
    </header>
  );
}
