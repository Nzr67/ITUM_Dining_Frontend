'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { fetchItems } from '@/lib/api';
import { cn } from '@/lib/utils';
import { StatusUpdateModal } from './home-page/status-update-modal';

interface FoodItem {
    id: string;
    name: string;
    description: string;
    canteen: string;
    current_status: string;
    ready_in_minutes: number | null;
    consensus_confidence: number;
}

interface CanteenMenuProps {
    canteenId: string;
    canteenName: string;
}

export default function CanteenMenu({ canteenId, canteenName }: CanteenMenuProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    const loadMenu = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchItems(canteenId);
            setMenuItems(data);
        } catch (error) {
            console.error('Error fetching menu:', error);
        } finally {
            setLoading(false);
        }
    }, [canteenId]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Failed to parse user', e);
            }
        }
        loadMenu();
    }, [loadMenu]);

    const filteredItems = menuItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderAvailabilityStatus = (item: FoodItem) => {
        const isAvailable = item.current_status === 'available';
        const isComingSoon = item.current_status === 'coming_soon';
        
        let label = item.current_status;
        if (isAvailable) label = 'Available';
        if (isComingSoon) label = 'Ready in ' + item.ready_in_minutes + 'm';
        if (item.current_status === 'unavailable') label = 'Not Available';
    
        return (
          <div className="flex flex-col items-end gap-0.5">
            <div 
              className={cn(
                "px-2.5 py-0.5 text-[9px] font-bold rounded-full border uppercase tracking-wider",
                isAvailable 
                  ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50" 
                  : isComingSoon
                    ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50"
                    : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50"
              )}
            >
              {label}
            </div>
            <div className="text-[8px] text-muted-foreground font-medium">
              {(item.consensus_confidence * 100).toFixed(0)}% Certain
            </div>
          </div>
        );
    };

    return (
        <div className="w-full min-h-screen bg-background p-4 md:p-8 flex flex-col items-center">
            
            <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-xl overflow-hidden flex flex-col h-[80vh] md:h-[750px]">
                
                {/* FIXED HEADER AND SEARCH BAR */}
                <div className="flex-shrink-0 bg-card p-5 border-b border-border">
                    <div className="flex items-center gap-2 mb-3">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => router.back()}
                            className="rounded-full"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="flex-1 text-center font-bold text-foreground tracking-wider text-xl uppercase">
                            {canteenName}
                        </h1>
                        <button 
                            onClick={loadMenu}
                            disabled={loading}
                            className="p-2 rounded-full hover:bg-accent transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                        </button>
                    </div>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search food items..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-muted border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <Search className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                    </div>
                </div>

                {/* DYNAMIC MENU CARDS LIST */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <RefreshCw className="w-8 h-8 animate-spin text-primary/40" />
                            <span className="text-sm text-muted-foreground">Loading menu...</span>
                        </div>
                    ) : filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <div key={item.id} className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col justify-between hover:border-primary/50 transition-colors group">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col">
                                        <h3 className="font-semibold text-foreground text-base">{item.name}</h3>
                                        <p className="text-[11px] text-muted-foreground line-clamp-1">{item.description}</p>
                                    </div>
                                    {renderAvailabilityStatus(item)}
                                </div>

                                {/* Crowd Report Action Block */}
                                <div className="mt-3 pt-2 border-t border-dashed border-border flex justify-between items-center">
                                    <span className="text-[11px] text-muted-foreground">Notice a change?</span>
                                    {user ? (
                                        <button 
                                            onClick={() => {
                                                setSelectedItem(item);
                                                setIsUpdateModalOpen(true);
                                            }}
                                            className="bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground text-[10px] px-3 py-1 rounded-lg font-bold transition-all uppercase tracking-tight"
                                        >
                                            Report Status
                                        </button>
                                    ) : (
                                        <Link href="/login" className="text-[10px] text-primary hover:underline font-medium">Login to report</Link>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-sm text-muted-foreground pt-12 flex flex-col items-center gap-2">
                            <div className="bg-muted p-4 rounded-full">
                                <Search className="w-6 h-6 opacity-20" />
                            </div>
                            <p>No items found in this canteen.</p>
                        </div>
                    )}
                </div>

            </div>

            {selectedItem && (
                <StatusUpdateModal 
                    isOpen={isUpdateModalOpen}
                    onClose={() => {
                        setIsUpdateModalOpen(false);
                        setSelectedItem(null);
                    }}
                    item={selectedItem}
                    onSuccess={loadMenu}
                />
            )}
        </div>
    );
}
