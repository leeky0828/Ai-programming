'use client';

import { useEffect, useState } from 'react';
import AdminLogin from '@/features/reservation/components/AdminLogin';
import AdminDashboard from '@/features/reservation/components/AdminDashboard';
import { useAdminStore } from '@/features/reservation/store/adminStore';

export default function AdminPage() {
  const { isAuthenticated, checkAuth } = useAdminStore();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    checkAuth();
    setIsLoading(false);
  }, [checkAuth]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p>로딩 중...</p>
      </div>
    );
  }
  
  return (
    <div className="py-10">
      <div className="container">
        {isAuthenticated ? <AdminDashboard /> : <AdminLogin />}
      </div>
    </div>
  );
} 