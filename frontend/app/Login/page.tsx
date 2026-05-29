'use client';

import React from 'react';
// යාළුවාගේ ෆයිල් එකෙන් 'LoginForm' එක නිවැරදිව ඉම්පෝර්ට් කරගන්නවා
import { LoginForm } from "@/components/login-page"; 

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* යාළුවා හදපු සැබෑ UI එක මෙතනින් රෙන්ඩර් වෙනවා */}
        <LoginForm /> 
      </div>
    </div>
  );
}