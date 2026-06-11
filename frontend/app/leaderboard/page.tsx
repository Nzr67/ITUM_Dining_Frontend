'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trophy, Medal, User as UserIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaderboardEntry {
  full_name: string;
  student_id: string;
  total_updates: number;
  reputation: number;
  avatar_url: string | null;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/leaderboard');
        if (response.ok) {
          const data = await response.json();
          setEntries(data);
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0: return 'text-yellow-500';
      case 1: return 'text-slate-400';
      case 2: return 'text-amber-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8 bg-background font-sans flex flex-col items-center text-foreground">
      <div className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-sm p-6 md:p-8 space-y-8 relative">
        <Link 
          href="/"
          className="absolute left-4 top-4 p-2 rounded-full hover:bg-accent transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="flex flex-col items-center text-center space-y-4 pt-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <Trophy className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-muted-foreground max-w-md text-sm">
            Top dining contributors ranked by their total status updates and verified reports.
          </p>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
              <span className="text-sm text-muted-foreground">Loading rankings...</span>
            </div>
          ) : entries.length === 0 ? (
            <div className="border border-border rounded-xl p-8 bg-muted/30 flex items-center justify-center min-h-[200px]">
              <span className="text-muted-foreground italic text-sm">No contributors yet. Start updating to climb the ranks!</span>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {entries.map((entry, index) => (
                <div key={index} className="flex items-center gap-4 py-4 px-2 hover:bg-muted/30 transition-colors rounded-lg">
                  <div className="flex items-center justify-center w-8 font-bold">
                    {index < 3 ? (
                      <Medal className={cn("w-6 h-6", getMedalColor(index))} />
                    ) : (
                      <span className="text-muted-foreground">{index + 1}</span>
                    )}
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden border border-border">
                    {entry.avatar_url ? (
                      <img src={entry.avatar_url} alt={entry.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate text-sm md:text-base">{entry.full_name}</p>
                    <p className="text-xs text-muted-foreground uppercase font-mono tracking-wider">{entry.student_id}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-primary">{entry.total_updates}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-medium">Updates</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center pt-4">
          <Link 
            href="/"
            className="px-6 py-2 text-sm font-medium border border-border text-foreground bg-background rounded-md hover:bg-accent hover:text-accent-foreground transition shadow-sm"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
