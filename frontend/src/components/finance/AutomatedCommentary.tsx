'use client';

import { useState } from 'react';
import { Bot, FileText, RefreshCw, Copy, Download } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { financeAPI } from '@/lib/api';
import type { FinanceDashboardResponse } from '@/lib/api';

interface AutomatedCommentaryProps {
  dashboardData: FinanceDashboardResponse | null;
  filters?: {
    countries?: string[];
    channels?: string[];
    statuses?: string[];
    date_start?: string;
    date_end?: string;
  };
}

export function AutomatedCommentary({ filters }: AutomatedCommentaryProps) {
  const [commentary, setCommentary] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const generateCommentary = async () => {
    setGenerating(true);
    setError('');

    try {
      const response = await financeAPI.getCommentary(filters);
      setCommentary(response.commentary);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to generate commentary';
      setError(errorMessage);
      console.error('Failed to generate commentary:', err);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(commentary);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const downloadAsText = () => {
    const blob = new Blob([commentary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cfo_commentary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Bot className='h-5 w-5' />
          🤖 AI-Powered CFO Commentary
        </CardTitle>
        <CardDescription>
          Real-time financial analysis powered by Azure OpenAI - generating
          actionable insights from your live data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <Button
            onClick={generateCommentary}
            disabled={generating}
            className='w-full'
          >
            {generating ? (
              <>
                <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                Generating AI Commentary...
              </>
            ) : (
              <>
                <FileText className='h-4 w-4 mr-2' />
                Generate CFO Commentary
              </>
            )}
          </Button>

          {error && (
            <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
              <strong>Error:</strong> {error}
            </div>
          )}

          {commentary && (
            <div className='bg-gray-50 p-4 rounded-lg border'>
              <div className='whitespace-pre-wrap text-sm font-mono leading-relaxed'>
                {commentary}
              </div>
              <div className='mt-4 flex gap-2'>
                <Button variant='outline' size='sm' onClick={downloadAsText}>
                  <Download className='h-4 w-4 mr-2' />
                  Download TXT
                </Button>
                <Button variant='outline' size='sm' onClick={copyToClipboard}>
                  <Copy className='h-4 w-4 mr-2' />
                  Copy to Clipboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
