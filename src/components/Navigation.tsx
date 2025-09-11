'use client';

import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  PieChart,
  Menu,
  X,
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navigationItems = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'pl', label: 'P&L Analysis', icon: TrendingUp },
  { id: 'working-capital', label: 'Working Capital', icon: PieChart },
  { id: 'receivables', label: 'AR Workbench', icon: DollarSign },
  { id: 'payables', label: 'AP Workbench', icon: DollarSign },
  { id: 'cash-flow', label: 'Cash Flow', icon: TrendingUp },
];

export default function Navigation({
  activeTab,
  setActiveTab,
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className='hidden md:flex bg-white shadow-lg border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full'>
          <div className='flex justify-between h-16'>
            <div className='flex items-center'>
              <div className='flex-shrink-0 flex items-center'>
                <BarChart3 className='h-8 w-8 text-blue-600' />
                <span className='ml-2 text-xl font-bold text-gray-900'>
                  Finance Cockpit
                </span>
              </div>
            </div>
            <div className='flex space-x-1'>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className='w-4 h-4 mr-2' />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className='md:hidden bg-white shadow-lg border-b border-gray-200'>
        <div className='px-4 sm:px-6'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center'>
              <BarChart3 className='h-8 w-8 text-blue-600' />
              <span className='ml-2 text-xl font-bold text-gray-900'>
                Finance Cockpit
              </span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='text-gray-600 hover:text-gray-900'
            >
              {isMobileMenuOpen ? (
                <X className='h-6 w-6' />
              ) : (
                <Menu className='h-6 w-6' />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className='border-t border-gray-200 bg-white'>
            <div className='px-2 pt-2 pb-3 space-y-1'>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className='w-4 h-4 mr-3' />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
