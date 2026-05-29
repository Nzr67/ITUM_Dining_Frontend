'use client'; // ඔයා කලින් 'use client' දාලා තිබ්බා නම් ඒක මෙහෙමම තියන්න

import React from 'react';
import Link from 'next/link'; // 👈 මෙන්න මේක තමයි අඩුවෙලා තිබ්බේ!
import CanteenButtons from './CanteenButtons';

// ... එතනින් පල්ලෙහාට ඔයාගේ ඉතුරු code එක සාමාන්‍ය විදිහටම තියෙන්න දෙන්න
// Data structure for the food items
const foodItemsData = [
  { name: 'Vegetable Food', label: 'Available', status: 'available' },
  { name: 'Fish Food', label: 'Not Available', status: 'notAvailable' },
  { name: 'Chicken Food', label: 'Available', status: 'available' },
  { name: 'Egg Food', label: 'Available', status: 'available' },
];

export default function Home() {
  const renderAvailabilityStatus = (status: string, label: string) => {
    const isAvailable = status === 'available';
    const textColor = isAvailable ? '#115E38' : '#8A151D';
    const bgColor = isAvailable ? '#E2FBE9' : '#FFEBEA';
    
    return (
      <div 
        className="px-4 py-1.5 text-base font-semibold rounded-full"
        style={{ color: textColor, backgroundColor: bgColor }}
      >
        {label}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen p-6 md:p-12 text-black bg-white font-sans flex items-center justify-center">
      
      {/* Outer Border Box */}
      <div className="w-full max-w-2xl border-2 border-zinc-900 rounded-xl p-6 md:p-8 space-y-8 bg-white">

        {/* Header Section */}
        <header className="flex items-center justify-between">
          {/* Hamburger Menu Icon */}
          <button className="flex flex-col gap-1.5 w-6 h-5 justify-between hover:opacity-70">
            <span className="w-full h-1 bg-zinc-900 rounded-full"></span>
            <span className="w-full h-1 bg-zinc-900 rounded-full"></span>
            <span className="w-full h-1 bg-zinc-900 rounded-full"></span>
          </button>

         {/* Action Buttons */}
<div className="flex gap-3">
  {/* Sign Up Link */}
  <Link 
    href="/signup" 
    className="px-5 py-2 text-md font-medium border-2 border-zinc-900 rounded-md bg-white hover:bg-zinc-100 transition text-center inline-block"
  >
    Sign Up
  </Link>
  
  {/* 👇 මෙන්න මේ කෑල්ල වෙනස් කරන්න. බටන් එක වෙනුවට Link එකක් දැම්මා */}
  <Link 
    href="/login" 
    className="px-5 py-2 text-md font-medium border-2 border-zinc-900 rounded-md bg-white hover:bg-zinc-100 transition text-center inline-block"
  >
    Sign In
  </Link>
</div>
        </header>

        {/* Canteen Clickable Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Canteen 1 Button */}
          <button 
            onClick={() => alert('Canteen 1 clicked!')}
            className="w-full h-32 border-2 border-zinc-900 rounded-xl flex items-center justify-center bg-white hover:bg-zinc-50 active:scale-95 transition-all shadow-sm"
          >
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Canteen 1
            </h1>
          </button>

          {/* Canteen 2 Button */}
          <button 
            onClick={() => alert('Canteen 2 clicked!')}
            className="w-full h-32 border-2 border-zinc-900 rounded-xl flex items-center justify-center bg-white hover:bg-zinc-50 active:scale-95 transition-all shadow-sm"
          >
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Canteen 2
            </h1>
          </button>

          {/* Canteen 3 Button */}
          <button 
            onClick={() => alert('Canteen 3 clicked!')}
            className="w-full h-32 border-2 border-zinc-900 rounded-xl flex items-center justify-center bg-white hover:bg-zinc-50 active:scale-95 transition-all shadow-sm"
          >
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Canteen 3
            </h1>
          </button>

        </div>

        {/* Menu Items Area */}
        <div className="border border-zinc-900 rounded-2xl p-6 space-y-4 bg-zinc-50 shadow">
          <h2 className="text-center text-2xl font-bold tracking-wide text-zinc-900 pb-2">
            Latest Updated !
          </h2>

          {/* Food Items List */}
          {foodItemsData.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-zinc-900 rounded-xl bg-white"
            >
              <span className="text-lg font-medium text-zinc-900">
                {item.name}
              </span>
              {renderAvailabilityStatus(item.status, item.label)}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}