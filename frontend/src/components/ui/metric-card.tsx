/**
 * Beautiful metric card component for displaying KPIs
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
  iconColor?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
  iconColor = 'text-blue-600',
}: MetricCardProps) {
  return (
    <Card
      className={cn(
        'transition-all duration-200 hover:shadow-lg border-0 shadow-sm',
        className
      )}
    >
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium text-muted-foreground'>
          {title}
        </CardTitle>
        <Icon className={cn('h-5 w-5', iconColor)} />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
          {value}
        </div>
        {subtitle && (
          <p className='text-xs text-muted-foreground mt-1'>{subtitle}</p>
        )}
        {trend && (
          <div className='mt-2'>
            <Badge
              variant={trend.isPositive ? 'default' : 'destructive'}
              className='text-xs'
            >
              {trend.isPositive ? '+' : ''}
              {trend.value}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
