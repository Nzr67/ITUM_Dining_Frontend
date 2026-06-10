'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Trophy, User, LogOut, Sun, Moon, Camera, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';

const foodItemsData = [
  { name: 'Vegetable Food', label: 'Available', status: 'available', canteen: 'Canteen 1' },
  { name: 'Fish Food', label: 'Not Available', status: 'notAvailable', canteen: 'Canteen 2' },
  { name: 'Chicken Food', label: 'Available', status: 'available', canteen: 'Canteen 1' },
  { name: 'Egg Food', label: 'Available', status: 'available', canteen: 'Canteen 3' },
];

export default function MainHome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const profileRef = useRef<HTMLDivElement>(null);

  // Profile Modal State
  const [newName, setNewName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setNewName(parsedUser.metadata?.full_name || '');
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    setUser(null);
    setIsProfileOpen(false);
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    const token = localStorage.getItem('access_token');
    
    try {
      const response = await fetch('http://localhost:8000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ full_name: newName })
      });

      if (response.ok) {
        const data = await response.json();
        const updatedUser = { ...user, metadata: data.user.user_metadata };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsProfileModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/user/upload-profile-pic', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        const updatedUser = { 
          ...user, 
          metadata: { ...user.metadata, avatar_url: data.avatar_url } 
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

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

            <span className="text-lg font-bold tracking-tight text-primary">ITUM DINING</span>
          </div>

          {/* Action Buttons or Profile Icon */}
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
                    <User className="w-5 h-5" />
                  )}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                    <div className="p-3 border-b border-border">
                      <p className="text-sm font-medium truncate">{user.metadata?.full_name || user.email}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        setIsProfileModalOpen(true);
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
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

          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-accent transition-colors group text-left"
          >
            {resolvedTheme === 'dark' ? (
              <>
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Sun className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Light Mode</div>
                  <div className="text-xs text-muted-foreground">Switch to a bright interface</div>
                </div>
              </>
            ) : (
              <>
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Moon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Dark Mode</div>
                  <div className="text-xs text-muted-foreground">Switch to a dark interface</div>
                </div>
              </>
            )}
          </button>
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
            onClick={() => router.push('/canteen/goda')}
            className="w-full h-28 border border-border rounded-xl flex items-center justify-center bg-card hover:bg-accent active:scale-[0.98] transition-all shadow-sm group"
          >
            <h1 className="text-xl font-semibold tracking-tight text-foreground/80 group-hover:text-foreground">Goda Canteen</h1>
          </button>

          <button 
            onClick={() => router.push('/canteen/vala')}
            className="w-full h-28 border border-border rounded-xl flex items-center justify-center bg-card hover:bg-accent active:scale-[0.98] transition-all shadow-sm group"
          >
            <h1 className="text-xl font-semibold tracking-tight text-foreground/80 group-hover:text-foreground">Vala Canteen</h1>
          </button>

          <button 
            onClick={() => router.push('/canteen/civil')}
            className="w-full h-28 border border-border rounded-xl flex items-center justify-center bg-card hover:bg-accent active:scale-[0.98] transition-all shadow-sm group"
          >
            <h1 className="text-xl font-semibold tracking-tight text-foreground/80 group-hover:text-foreground">Civil Canteen</h1>
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
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground/70">
                    {item.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.canteen}
                  </span>
                </div>
                {renderAvailabilityStatus(item.status, item.label)}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute right-4 top-4 p-1 rounded-full hover:bg-accent transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-6">Edit Profile</h2>

            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full border-2 border-primary/20 overflow-hidden bg-muted flex items-center justify-center">
                  {user?.metadata?.avatar_url ? (
                    <img src={user.metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-muted-foreground" />
                  )}
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform disabled:opacity-50"
                  disabled={uploadingImage}
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Click the camera to upload a photo</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <Field>
                <FieldLabel htmlFor="full-name">Full Name</FieldLabel>
                <Input 
                  id="full-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </Field>

              <div className="flex gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsProfileModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={isUpdating}
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
