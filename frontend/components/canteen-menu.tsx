'use client';

import { useState, useEffect } from 'react';
import { Search, ArrowLeft, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import FoodStatusPopup from './food-status-popup';

// Define what a Food Item looks like for TypeScript (Price completely removed)
interface FoodItem {
    food_id: number;
    food_name: string;
    status: string;
    last_verified?: string;
}

interface CanteenMenuProps {
    canteenId: string;
    canteenName: string;
}

export default function CanteenMenu({ canteenId, canteenName }: CanteenMenuProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
    const router = useRouter();

 
    const BACKEND_URL = "http://localhost:8000";
    
    // Attempt to get student ID from localStorage, fallback to test ID
    const [studentId, setStudentId] = useState("IT2024_01");

    useEffect(() => {
        let currentStudentId = "IT2024_01";
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                if (user && user.id) {
                    currentStudentId = user.id;
                    setStudentId(user.id);
                }
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
            }
        }
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            // In a real app, you might pass canteenId to the API
            const response = await fetch(`${BACKEND_URL}/api/get-menu`);
            const data = await response.json();
            if (data.status === "success") {
                setMenuItems(data.menu);
            }
        } catch (error) {
            console.error("Error communicating with backend server:", error);
        } finally {
            setLoading(false);
        }
    };

    // RUNS ON CLICK: Sends your status report back to the local API
    const handleStatusUpdate = async (foodId: number, selectedStatus: string) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/verify-spatial-update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    student_id: studentId,
                    food_id: foodId,
                    status: selectedStatus
                })
            });
            
            const data = await response.json();
            if (response.ok && data.status === "success") {
                alert(`Success: ${data.message}`);
                fetchMenu(); // Re-sync frontend UI with local backend state automatically
            } else {
                alert(`Failed: ${data.message}`);
            }
        } catch (error) {
            alert("Network error: Could not reach Python server.");
        }
    };

    // Filter list entries based on Search bar input box
    const filteredItems = menuItems.filter(item =>
        item.food_name.toLowerCase().includes(searchQuery.toLowerCase())
    );



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
                        <div className="w-10"></div> {/* Spacer for symmetry */}
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
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <div key={item.food_id} className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col justify-between hover:border-primary/50 transition-colors">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold text-foreground text-base">{item.food_name}</h3>
                                    </div>
                                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                                        item.status === 'Available' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                        item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    }`}>
                                        {item.status}
                                    </span>
                                </div>

                                {/* Crowd Report Action Block */}
                                <div className="mt-3 pt-2 border-t border-dashed border-border flex justify-between items-center">
                                    <span className="text-[11px] text-muted-foreground">Notice a change?</span>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => {
                                                setSelectedFood(item);
                                                setIsPopupOpen(true);
                                            }}
                                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 text-xs px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1"
                                        >
                                            <RefreshCw className="w-3 h-3" /> Update
                                        </button>
                                        <button 
                                            onClick={() => handleStatusUpdate(item.food_id, 'Low Stock')}
                                            className="bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/30 text-xs px-2.5 py-1 rounded-lg font-medium transition"
                                        >
                                            ⚠️ Low
                                        </button>
                                        <button 
                                            onClick={() => handleStatusUpdate(item.food_id, 'Not-Available')}
                                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/30 text-xs px-2.5 py-1 rounded-lg font-medium transition"
                                        >
                                            ❌ Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-sm text-muted-foreground pt-8">
                            No food items found matching your search.
                        </div>
                    )}
                </div>

            </div>

            {selectedFood && (
                <FoodStatusPopup
                    isOpen={isPopupOpen}
                    onClose={() => setIsPopupOpen(false)}
                    foodId={selectedFood.food_id}
                    foodName={selectedFood.food_name}
                    studentId={studentId}
                    onUpdateSuccess={fetchMenu}
                />
            )}
        </div>
    );
}
