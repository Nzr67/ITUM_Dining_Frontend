'use client';

import React from 'react';
// යාළුවාගේ ෆයිල් එකෙන් 'SignupForm' එක නිවැරදිව ඉම්පෝර්ට් කරගන්නවා
import { SignupForm } from "@/components/signup-page"; 

export default function SignUpRoute() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white p-6 md:p-10">
      <div className="w-full max-w-md">
        {/* යාළුවා හදපු සැබෑ UI එක මෙතනින් රෙන්ඩර් වෙනවා */}
        <SignupForm /> 
      </div>
    </div>
  );
}