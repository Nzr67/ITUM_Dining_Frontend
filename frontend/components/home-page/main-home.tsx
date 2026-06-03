'use client';

import React from 'react';
import Link from 'next/link';
import { ModeToggle } from '@/components/mode-toggle';
import { cn } from '@/lib/utils';

const foodItemsData = [
  { name: 'Vegetable Food', label: 'Available', status: 'available' },
  { name: 'Fish Food', label: 'Not Available', status: 'notAvailable' },
  { name: 'Chicken Food', label: 'Available', status: 'available' },
  { name: 'Egg Food', label: 'Available', status: 'available' },
];

export default function MainHome() {
  const renderAvailabilityStatus = (status: string, label: string) => {
    const isAvailable = status === 'available';

    return (
      <div 
        className={cn(
          "px-3 py-1 text-xs font-medium rounded-full border transition-colors",
          isAvailable 
            ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50" 
            : "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50"
        )}
      >
        {label}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8 bg-background font-sans flex items-center justify-center text-foreground">

      <div className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-sm p-6 md:p-8 space-y-8">

        {/* Header Section */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Hamburger Menu Icon */}
            <div className="flex flex-col gap-1 w-5 h-4 justify-between cursor-pointer opacity-70 hover:opacity-100 transition">
              <span className="w-full h-[2px] bg-foreground rounded-full"></span>
              <span className="w-full h-[2px] bg-foreground rounded-full"></span>
              <span className="w-full h-[2px] bg-foreground rounded-full"></span>
            </div>

            <ModeToggle />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link 
              href="/signup?from=/" 
              className="px-4 py-2 text-sm font-medium border border-border text-foreground bg-background rounded-md hover:bg-accent hover:text-accent-foreground transition shadow-sm text-center inline-block"
            >
              Sign Up
            </Link>
            <Link 
              href="/login?from=/" 
              className="px-4 py-2 text-sm font-medium border border-border text-foreground bg-background rounded-md hover:bg-accent hover:text-accent-foreground transition shadow-sm text-center inline-block"
            >
              Sign In
            </Link>
          </div>
        </header>

        {/* Clickable Canteen Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => alert('Canteen 1 Clicked!')}
            className="w-full h-28 border border-border rounded-xl flex items-center justify-center bg-card hover:bg-accent active:scale-[0.98] transition-all shadow-sm group"
          >
            <h1 className="text-xl font-semibold tracking-tight text-foreground/80 group-hover:text-foreground">Canteen 1</h1>
          </button>

          <button 
            onClick={() => alert('Canteen 2 Clicked!')}
            className="w-full h-28 border border-border rounded-xl flex items-center justify-center bg-card hover:bg-accent active:scale-[0.98] transition-all shadow-sm group"
          >
            <h1 className="text-xl font-semibold tracking-tight text-foreground/80 group-hover:text-foreground">Canteen 2</h1>
          </button>

          <button 
            onClick={() => alert('Canteen 3 Clicked!')}
            className="w-full h-28 border border-border rounded-xl flex items-center justify-center bg-card hover:bg-accent active:scale-[0.98] transition-all shadow-sm group"
          >
            <h1 className="text-xl font-semibold tracking-tight text-foreground/80 group-hover:text-foreground">Canteen 3</h1>
          </button>
        </div>

        {/* Menu Items Area */}
        <div className="border border-border rounded-xl p-5 space-y-4 bg-muted/50">
          <h2 className="text-center text-lg font-semibold tracking-tight text-foreground pb-1">
            Latest Updated !
          </h2>

          {/* Food Items List */}
          <div className="space-y-2.5">
            {foodItemsData.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3.5 border border-border rounded-lg bg-card shadow-sm hover:border-accent transition"
              >
                <span className="text-sm font-medium text-foreground/70">
                  {item.name}
                </span>
                {renderAvailabilityStatus(item.status, item.label)}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
