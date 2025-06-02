'use client';

import ReservationForm from '@/features/reservation/components/ReservationForm';

export default function ReservationPage() {
  return (
    <div className="py-10">
      <div className="container">
        <h1 className="text-3xl font-bold text-center mb-8">미용실 예약하기</h1>
        <ReservationForm />
      </div>
    </div>
  );
} 