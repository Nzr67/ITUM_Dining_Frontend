'use client';

import React from 'react';
import Link from 'next/link';

const foodItemsData = [
  { name: 'Vegetable Food', label: 'Available', status: 'available' },
  { name: 'Fish Food', label: 'Not Available', status: 'notAvailable' },
  { name: 'Chicken Food', label: 'Available', status: 'available' },
  { name: 'Egg Food', label: 'Available', status: 'available' },
];

export default function MainHome() {
  const renderAvailabilityStatus = (status: string, label: string) => {
    const isAvailable = status === 'available';
    // සයින්-අප් එකේ ඩිසයින් එකටම ගැලපෙන සොෆ්ට් කලර්ස්
    const textColor = isAvailable ? '#16a34a' : '#dc2626';
    const bgColor = isAvailable ? '#f0fdf4' : '#fef2f2';
    
    return (
      <div 
        className="px-3 py-1 text-xs font-medium rounded-full border"
        style={{ color: textColor, backgroundColor: bgColor, borderColor: isAvailable ? '#bbf7d0' : '#fecaca' }}
      >
        {label}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8 bg-[#fafafa] font-sans flex items-center justify-center text-zinc-900">
      
      {/* Outer Card - සයින් අප් කාඩ් එකේ හැඩයටම හදපු ප්‍රධාන කොටුව */}
      <div className="w-full max-w-2xl bg-white border border-zinc-200 rounded-xl shadow-sm p-6 md:p-8 space-y-8">

        {/* Header Section */}
        <header className="flex items-center justify-between">
          {/* Hamburger Menu Icon */}
          <div className="flex flex-col gap-1 w-5 h-4 justify-between cursor-pointer opacity-70 hover:opacity-100 transition">
            <span className="w-full h-[2px] bg-zinc-900 rounded-full"></span>
            <span className="w-full h-[2px] bg-zinc-900 rounded-full"></span>
            <span className="w-full h-[2px] bg-zinc-900 rounded-full"></span>
          </div>

          {/* Action Buttons - සයින්-අප් පේජ් එකේ බටන් ස්ටයිල් එකටම හැදුවා */}
          <div className="flex gap-2">
            <Link 
              href="/Sign_up?from=/" 
              className="px-4 py-2 text-sm font-medium border border-zinc-200 text-zinc-900 bg-white rounded-md hover:bg-zinc-50 hover:text-zinc-900 transition shadow-sm text-center inline-block"
            >
              Sign Up
            </Link>
            <Link 
              href="/Login?from=/" 
              className="px-4 py-2 text-sm font-medium border border-zinc-200 text-zinc-900 bg-white rounded-md hover:bg-zinc-50 hover:text-zinc-900 transition shadow-sm text-center inline-block"
            >
              Sign In
            </Link>
          </div>
        </header>

        {/* Clickable Canteen Buttons - බොත්තම් වල දාර සහ සෙවනැලි සියුම් කලා */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => alert('Canteen 1 Clicked!')}
            className="w-full h-28 border border-zinc-200 rounded-xl flex items-center justify-center bg-white hover:bg-zinc-50 active:scale-[0.98] transition-all shadow-sm group"
          >
            <h1 className="text-xl font-semibold tracking-tight text-zinc-800 group-hover:text-zinc-900">Canteen 1</h1>
          </button>

          <button 
            onClick={() => alert('Canteen 2 Clicked!')}
            className="w-full h-28 border border-zinc-200 rounded-xl flex items-center justify-center bg-white hover:bg-zinc-50 active:scale-[0.98] transition-all shadow-sm group"
          >
            <h1 className="text-xl font-semibold tracking-tight text-zinc-800 group-hover:text-zinc-900">Canteen 2</h1>
          </button>

          <button 
            onClick={() => alert('Canteen 3 Clicked!')}
            className="w-full h-28 border border-zinc-200 rounded-xl flex items-center justify-center bg-white hover:bg-zinc-50 active:scale-[0.98] transition-all shadow-sm group"
          >
            <h1 className="text-xl font-semibold tracking-tight text-zinc-800 group-hover:text-zinc-900">Canteen 3</h1>
          </button>
        </div>

        {/* Menu Items Area */}
        <div className="border border-zinc-100 rounded-xl p-5 space-y-4 bg-zinc-50/50">
          <h2 className="text-center text-lg font-semibold tracking-tight text-zinc-800 pb-1">
            Latest Updated !
          </h2>

          {/* Food Items List */}
          <div className="space-y-2.5">
            {foodItemsData.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3.5 border border-zinc-200/80 rounded-lg bg-white shadow-sm hover:border-zinc-300 transition"
              >
                <span className="text-sm font-medium text-zinc-700">
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