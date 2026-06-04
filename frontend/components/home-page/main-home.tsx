'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ModeToggle } from '@/components/mode-toggle';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Trophy } from 'lucide-react';

const foodItemsData = [
  { name: 'Vegetable Food', label: 'Available', status: 'available' },
  { name: 'Fish Food', label: 'Not Available', status: 'notAvailable' },
  { name: 'Chicken Food', label: 'Available', status: 'available' },
  { name: 'Egg Food', label: 'Available', status: 'available' },
];

export default function MainHome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

      <div className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-sm p-6 md:p-8 space-y-8 relative overflow-hidden">

        {/* Header Section */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Hamburger Menu Icon */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex flex-col gap-1.5 w-6 h-5 justify-center items-center cursor-pointer opacity-70 hover:opacity-100 transition-all z-50"
              aria-label="Toggle Menu"
            >
              <span className={cn(
                "w-5 h-[2px] bg-foreground rounded-full transition-all duration-300 origin-center",
                isMenuOpen ? "rotate-45 translate-y-[4px]" : ""
              )}></span>
              <span className={cn(
                "w-5 h-[2px] bg-foreground rounded-full transition-all duration-300",
                isMenuOpen ? "opacity-0 scale-0" : ""
              )}></span>
              <span className={cn(
                "w-5 h-[2px] bg-foreground rounded-full transition-all duration-300 origin-center",
                isMenuOpen ? "-rotate-45 -translate-y-[4px]" : ""
              )}></span>
            </button>

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

        {/* Sliding Menu Overlay */}
        <div 
          className={cn(
            "absolute inset-0 bg-card/95 backdrop-blur-sm z-40 flex flex-col p-8 transition-all duration-500 ease-in-out",
            isMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"
          )}
        >
          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight mb-8">Menu</h2>
            <nav className="flex flex-col gap-4">
              <Link 
                href="/" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-accent transition-colors group"
              >
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <LayoutDashboard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Dashboard</div>
                  <div className="text-xs text-muted-foreground">View your food overview</div>
                </div>
              </Link>

              <Link 
                href="/leaderboard" 
                target="_blank"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-accent transition-colors group"
              >
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Leaderboard</div>
                  <div className="text-xs text-muted-foreground">See top dining contributors</div>
                </div>
              </Link>
            </nav>
          </div>
          
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="mt-auto p-4 text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Close Menu
          </button>
        </div>

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
