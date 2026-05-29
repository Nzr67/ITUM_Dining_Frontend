'use client';

import React from 'react';
// ඔයා අලුතෙන් හදපු ෆෝල්ඩරයේ තියෙන කෝඩ් එක මෙතනට ඉම්පෝර්ට් කරනවා
import MainHome from "@/components/home-page/main-home"; 

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-white">
      {/* ඔයාගේ මුළු හෝම් පේජ් එකම මෙතනින් ලස්සනට ලෝඩ් වෙනවා */}
      <MainHome /> 
    </main>
  );
}