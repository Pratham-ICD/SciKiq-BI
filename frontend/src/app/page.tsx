import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  ArrowRight,
} from 'lucide-react';

export default function HomePage() {
  const modules = [
    {
      title: 'Finance',
      description: 'Comprehensive financial analytics and reporting',
      icon: TrendingUp,
      href: '/finance',
      color: 'bg-blue-500',
      features: [
        'P&L Analysis',
        'Budget Tracking',
        'Cash Flow',
        'Financial Reports',
      ],
    },
    {
      title: 'HR Management',
      description: 'Employee analytics and workforce insights',
      icon: Users,
      href: '/hr',
      color: 'bg-green-500',
      features: [
        'Employee Data',
        'Payroll Analysis',
        'Leave Management',
        'Performance',
      ],
    },
    {
      title: 'Supply Chain',
      description: 'Inventory and supply chain optimization',
      icon: Package,
      href: '/supply-chain',
      color: 'bg-purple-500',
      features: [
        'Inventory Tracking',
        'Supplier Analytics',
        'Cost Analysis',
        'Demand Planning',
      ],
    },
    {
      title: 'Order Journey',
      description: 'Customer order tracking and analytics',
      icon: ShoppingCart,
      href: '/order-journey',
      color: 'bg-orange-500',
      features: [
        'Order Tracking',
        'Customer Journey',
        'Fulfillment',
        'Returns',
      ],
    },
    {
      title: 'Marketing',
      description: 'Marketing performance and campaign analytics',
      icon: BarChart3,
      href: '/marketing',
      color: 'bg-pink-500',
      features: [
        'Campaign Analytics',
        'Channel Performance',
        'Customer Insights',
        'ROI Tracking',
      ],
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
      {/* Hero Section */}
      <div className='relative bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl'>
              Scikiq
              <span className='block text-blue-600'>
                Business Intelligence Demo
              </span>
            </h1>
            <div className='mt-10 flex items-center justify-center gap-x-6'>
              <Link href='/finance'>
                <Button size='lg' className='bg-blue-600 hover:bg-blue-700'>
                  Get Started
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold tracking-tight text-gray-900'>
            Modules
          </h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {modules.map((module) => {
            const IconComponent = module.icon;
            return (
              <Card
                key={module.title}
                className='hover:shadow-lg transition-shadow cursor-pointer group'
              >
                <Link href={module.href}>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div
                        className={`p-2 rounded-lg ${module.color} text-white`}
                      >
                        <IconComponent className='h-6 w-6' />
                      </div>
                      <div>
                        <CardTitle className='text-xl group-hover:text-blue-600 transition-colors'>
                          {module.title}
                        </CardTitle>
                      </div>
                    </div>
                    <CardDescription className='text-sm text-gray-600'>
                      {module.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='flex flex-wrap gap-1'>
                      {module.features.map((feature) => (
                        <Badge
                          key={feature}
                          variant='secondary'
                          className='text-xs'
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className='bg-gray-900 text-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='text-center'>
            <p className='text-gray-400'>© 2025 Scikiq</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
