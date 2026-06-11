'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Trophy, User as UserIcon, LogOut, Sun, Moon, RefreshCw, Clock, MapPin, UserPlus } from 'lucide-react';
import { fetchRecentUpdates } from '@/lib/api';

interface UpdateRecord {
  id: string;
  item_id: string;
  reported_status: string;
  ready_in_minutes: number | null;
  created_at: string;
  menu_items: { name: string; canteen: string };
  profiles: { full_name: string };
}

interface UserProfile {
  id: string;
  email: string;
  metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export default function MainHome() {
  const [recentUpdates, setRecentUpdates] = useState<UpdateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const { setTheme, resolvedTheme } = useTheme();
  const profileRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    setUser(null);
    setIsProfileOpen(false);
    router.refresh();
  }, [router]);

  const loadRecentUpdates = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchRecentUpdates();
      setRecentUpdates(data || []);
    } catch (error) {
      console.error('Failed to load recent updates:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initData = async () => {
        await loadRecentUpdates();
        
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('access_token');
        
        if (storedUser && token) {
          try {
            const parsedUser = JSON.parse(storedUser);
            
            // Basic JWT expiration check (client-side)
            try {
              const base64Url = token.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                  return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              }).join(''));

              const payload = JSON.parse(jsonPayload);
              if (payload.exp && Date.now() >= payload.exp * 1000) {
                console.warn('Token expired, logging out');
                handleLogout();
                return;
              }
            } catch (e) {
              console.error('Failed to parse token payload', e);
            }

            setUser(parsedUser);
          } catch (e) {
            console.error('Failed to parse user', e);
            handleLogout();
          }
        } else {
          setUser(null);
        }
    };

    initData();

    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [loadRecentUpdates, handleLogout]);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const formatTimeAgo = (dateStr: string) => {
    const now = new Date();
    const past = new Date(dateStr);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return Math.floor(diffInSeconds / 60) + 'm ago';
    if (diffInSeconds < 86400) return Math.floor(diffInSeconds / 3600) + 'h ago';
    return Math.floor(diffInSeconds / 86400) + 'd ago';
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8 bg-background font-sans flex items-center justify-center text-foreground">

      <div className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-sm p-6 md:p-8 space-y-8 relative overflow-hidden">

        {/* Header Section */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
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

            <span className="text-lg font-bold tracking-tight text-primary">ITUM DINING</span>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-10 h-10 rounded-full border border-border hover:bg-accent transition-colors overflow-hidden flex items-center justify-center bg-muted"
                  aria-label="User Profile"
                >
                  {user.metadata?.avatar_url ? (
                    <img src={user.metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-5 h-5" />
                  )}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                    <div className="p-3 border-b border-border">
                      <p className="text-sm font-medium truncate">{user.metadata?.full_name || user.email}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-accent transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link 
                  href="/signup" 
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-md hover:opacity-90 transition"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Sign Up
                </Link>
                <Link 
                  href="/login" 
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition shadow-sm"
                >
                  <UserIcon className="w-3.5 h-3.5" /> Sign In
                </Link>
              </div>
            )}
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
              </div>
            </Link>

            <Link 
              href="/leaderboard" 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-accent transition-colors group"
            >
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold">Leaderboard</div>
              </div>
            </Link>
          </nav>

          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-accent transition-colors group text-left"
          >
            {resolvedTheme === 'dark' ? (
              <><Sun className="w-5 h-5 mr-4" /> Light Mode</>
            ) : (
              <><Moon className="w-5 h-5 mr-4" /> Dark Mode</>
            )}
          </button>
        </div>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="mt-auto p-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Close Menu
          </button>
        </div>

        {/* Clickable Canteen Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => router.push('/canteen/goda')}
            className="w-full h-24 border border-border rounded-xl flex items-center justify-center bg-card hover:bg-accent transition-all shadow-sm group"
          >
            <MapPin className="w-4 h-4 mr-2 text-primary opacity-50 group-hover:opacity-100" />
            <h1 className="font-semibold tracking-tight">Goda</h1>
          </button>

          <button 
            onClick={() => router.push('/canteen/vala')}
            className="w-full h-24 border border-border rounded-xl flex items-center justify-center bg-card hover:bg-accent transition-all shadow-sm group"
          >
            <MapPin className="w-4 h-4 mr-2 text-primary opacity-50 group-hover:opacity-100" />
            <h1 className="font-semibold tracking-tight">Vala</h1>
          </button>

          <button 
            onClick={() => router.push('/canteen/civil')}
            className="w-full h-24 border border-border rounded-xl flex items-center justify-center bg-card hover:bg-accent transition-all shadow-sm group"
          >
            <MapPin className="w-4 h-4 mr-2 text-primary opacity-50 group-hover:opacity-100" />
            <h1 className="font-semibold tracking-tight">Civil</h1>
          </button>
        </div>

        {/* Recent Activity Feed */}
        <div className="border border-border rounded-xl p-5 space-y-4 bg-muted/30">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Latest Updates</h2>
            <button 
              onClick={loadRecentUpdates}
              className="p-1.5 rounded-full hover:bg-accent transition-colors"
              title="Refresh Feed"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </button>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8 text-sm text-muted-foreground">Loading activity...</div>
            ) : recentUpdates.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">No recent user activity.</div>
            ) : (
              recentUpdates.map((update) => (
                <div key={update.id} className="flex items-start gap-3 p-3 border border-border rounded-lg bg-card shadow-sm">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">{update.profiles?.full_name || 'Someone'}</span> 
                      {' reported '}
                      <span className="font-medium text-primary">{update.menu_items?.name}</span>
                      {update.menu_items?.canteen && (
                        <span className="text-[10px] text-muted-foreground ml-1 italic">
                          ({update.menu_items.canteen})
                        </span>
                      )}
                      {' as '}
                      <span className={cn(
                        "font-bold",
                        update.reported_status === 'available' ? 'text-green-600' :
                        update.reported_status === 'unavailable' ? 'text-red-600' : 'text-blue-600'
                      )}>
                        {update.reported_status === 'coming_soon' ? 'Coming Soon' : update.reported_status}
                      </span>
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {formatTimeAgo(update.created_at)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
