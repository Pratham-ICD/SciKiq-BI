'use client';

import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  PieChart,
  Menu,
  X,
  Home,
  Settings,
  Users,
  FileText,
  ChevronDown,
  Building2,
} from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const modules = [
  {
    id: 'finance',
    label: 'Finance Cockpit',
    icon: DollarSign,
    tabs: [
      { id: 'overview', label: 'Overview', icon: Home },
      { id: 'pl', label: 'P&L Analysis', icon: TrendingUp },
      { id: 'working-capital', label: 'Working Capital', icon: PieChart },
      { id: 'receivables', label: 'AR Workbench', icon: FileText },
      { id: 'payables', label: 'AP Workbench', icon: FileText },
      { id: 'cash-flow', label: 'Cash Flow', icon: BarChart3 },
    ],
  },
  {
    id: 'hr',
    label: 'HR Dashboard',
    icon: Users,
    tabs: [
      { id: 'hr-overview', label: 'People Overview', icon: Home },
      { id: 'attrition-risk', label: 'Attrition Risk', icon: TrendingUp },
      { id: 'recruiting', label: 'Recruiting', icon: FileText },
      { id: 'engagement', label: 'Engagement & Performance', icon: BarChart3 },
      { id: 'compensation', label: 'Comp & Equity', icon: DollarSign },
      { id: 'absence', label: 'Absence', icon: Settings },
    ],
  },
];

export default function Sidebar({
  activeModule,
  setActiveModule,
  activeTab,
  setActiveTab,
}: SidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedModule, setExpandedModule] = useState(activeModule);

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white z-50 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${isSidebarOpen ? 'w-80' : 'w-16'} lg:w-80`}
      >
        {/* Header */}
        <div className='p-6 border-b border-slate-700'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              {/* Logo placeholder */}
              <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
                <Building2 className='w-6 h-6 text-white' />
              </div>
              <div className={`${!isSidebarOpen && 'hidden'} lg:block`}>
                <h1 className='text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                  Scikiq
                </h1>
                <p className='text-xs text-slate-400'>Business Intelligence</p>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className='lg:hidden text-slate-400 hover:text-white'
            >
              <X className='w-5 h-5' />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className='p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-120px)]'>
          {modules.map((module) => {
            const Icon = module.icon;
            const isExpanded = expandedModule === module.id;
            const isActive = activeModule === module.id;

            return (
              <div key={module.id} className='space-y-1'>
                <button
                  onClick={() => {
                    setActiveModule(module.id);
                    setExpandedModule(isExpanded ? '' : module.id);
                    if (module.tabs.length > 0) {
                      setActiveTab(module.tabs[0].id);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <div className='flex items-center space-x-3'>
                    <Icon className='w-5 h-5' />
                    <span className={`${!isSidebarOpen && 'hidden'} lg:block`}>
                      {module.label}
                    </span>
                  </div>
                  {module.tabs.length > 0 && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      } ${!isSidebarOpen && 'hidden'} lg:block`}
                    />
                  )}
                </button>

                {/* Sub-navigation */}
                {isExpanded && module.tabs.length > 0 && (
                  <div
                    className={`space-y-1 ml-4 ${
                      !isSidebarOpen && 'hidden'
                    } lg:block`}
                  >
                    {module.tabs.map((tab) => {
                      const TabIcon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                            activeTab === tab.id
                              ? 'bg-slate-700 text-blue-400 border-l-2 border-blue-400'
                              : 'text-slate-400 hover:text-white hover:bg-slate-700'
                          }`}
                        >
                          <TabIcon className='w-4 h-4' />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className={`absolute bottom-4 left-4 right-4 ${
            !isSidebarOpen && 'hidden'
          } lg:block`}
        >
          <div className='bg-slate-800 rounded-lg p-3 border border-slate-700'>
            <p className='text-xs text-slate-400 text-center'>
              © 2025 Scikiq. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className='fixed top-4 left-4 z-40 lg:hidden bg-slate-900 text-white p-2 rounded-lg shadow-lg'
      >
        <Menu className='w-5 h-5' />
      </button>
    </>
  );
}
