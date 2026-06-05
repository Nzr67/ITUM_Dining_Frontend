'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Trophy } from 'lucide-react';

export default function LeaderboardPage() {
  return (
    <div className="w-full min-h-screen p-4 md:p-8 bg-background font-sans flex items-center justify-center text-foreground">
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
          <p className="text-muted-foreground max-w-md">
            The leaderboard is coming soon! Check back later to see the top dining contributors and rankings.
          </p>
        </div>

        <div className="border border-border rounded-xl p-8 bg-muted/30 flex items-center justify-center min-h-[200px]">
          <span className="text-muted-foreground italic text-sm">No data available yet...</span>
        </div>

        <div className="flex justify-center">
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
