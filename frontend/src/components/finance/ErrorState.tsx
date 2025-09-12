'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <Card className='border-red-200 bg-red-50'>
      <CardContent className='pt-6'>
        <div className='flex items-center space-x-2'>
          <AlertCircle className='h-5 w-5 text-red-600' />
          <div>
            <p className='font-medium text-red-800'>
              Error loading financial data
            </p>
            <p className='text-sm text-red-600'>{error}</p>
            <Button
              onClick={onRetry}
              variant='outline'
              size='sm'
              className='mt-2'
            >
              Try Again
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
