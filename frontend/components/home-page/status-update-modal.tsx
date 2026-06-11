'use client';

import * as React from 'react';
import { useState } from 'react';
import { X, Loader2, Info, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import { submitUpdate } from '@/lib/api';

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    name: string;
    current_status: string;
    canteen?: string;
  };
  onSuccess: () => void;
}

export function StatusUpdateModal({ isOpen, onClose, item, onSuccess }: StatusUpdateModalProps) {
  const [status, setStatus] = useState<string>(item.current_status);
  const [timeStr, setTimeStr] = useState<string>('00:00:00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 6) value = value.slice(0, 6);
    
    let formatted = value;
    if (value.length >= 5) {
        formatted = value.slice(0, 2) + ':' + value.slice(2, 4) + ':' + value.slice(4, 6);
    } else if (value.length >= 3) {
        formatted = value.slice(0, 2) + ':' + value.slice(2, 4);
    }
    setTimeStr(formatted);
  };

  const parseToMinutes = (hms: string): number => {
    const parts = hms.split(':').map(Number);
    let totalSeconds = 0;
    if (parts.length === 3) {
      totalSeconds = (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
    } else if (parts.length === 2) {
      totalSeconds = (parts[0] || 0) * 60 + (parts[1] || 0);
    } else if (parts.length === 1) {
      totalSeconds = (parts[0] || 0);
    }
    return Math.max(1, Math.ceil(totalSeconds / 60));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('access_token') || '';
    if (!token) {
      setError('You must be logged in to submit an update.');
      setLoading(false);
      return;
    }

    try {
      const readyInMinutes = status === 'coming_soon' ? parseToMinutes(timeStr) : undefined;
      
      await submitUpdate(
        item.id, 
        status, 
        readyInMinutes,
        token
      );
      onSuccess();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit update. Is the backend running?';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-background/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4'>
      <div className='bg-card border border-border rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200'>
        <button 
          onClick={onClose}
          className='absolute right-4 top-4 p-1 rounded-full hover:bg-accent transition-colors'
        >
          <X className='w-5 h-5' />
        </button>

        <h2 className='text-xl font-bold mb-2'>Update Status</h2>
        <p className='text-sm text-muted-foreground mb-6'>
          Reporting for: <span className='font-semibold text-foreground'>{item.name}</span>
          {item.canteen && <span className="ml-1 text-[10px] text-primary/70 font-bold uppercase">• {item.canteen}</span>}
        </p>

        {error && (
          <div className='bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4 flex items-center gap-2'>
            <Info className='w-4 h-4' />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <Field>
            <FieldLabel>Current Availability</FieldLabel>
            <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
                <option value="available">Available</option>
                <option value="unavailable">Not Available</option>
                <option value="coming_soon">Will be ready in</option>
            </select>
          </Field>

          {status === 'coming_soon' && (
            <Field>
              <FieldLabel htmlFor='ready-in'>Estimated Ready Time (HH:MM:SS)</FieldLabel>
              <div className='relative'>
                <Input 
                  id='ready-in'
                  type='text'
                  placeholder='00:00:00'
                  value={timeStr}
                  onChange={handleTimeChange}
                  className='pl-10'
                  required
                />
                <Clock className='absolute left-3 top-3 w-4 h-4 text-muted-foreground' />
              </div>
              <p className='text-[10px] text-muted-foreground mt-1'>
                Enter the time remaining until the food is ready.
              </p>
            </Field>
          )}

          <div className='pt-4 flex gap-3'>
            <Button 
              type='button' 
              variant='outline' 
              className='flex-1'
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type='submit' 
              className='flex-1'
              disabled={loading}
            >
              {loading && <Loader2 className='w-4 h-4 animate-spin mr-2' />}
              Submit Report
            </Button>
          </div>
        </form>
        
        <p className='text-[10px] text-muted-foreground mt-4 text-center'>
          Your report will be processed by our consensus algorithm. Accurate reports increase your reputation!
        </p>
      </div>
    </div>
  );
}
