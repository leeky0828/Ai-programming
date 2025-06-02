'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatReadableDate, formatTime } from '../lib/datetime';
import { CheckCircle2 } from 'lucide-react';
import { Reservation } from '../lib/types';
import { getReservationById } from '../lib/storage';
import { SERVICES } from '../constants/services';
import { STYLISTS } from '../constants/stylists';
import Link from 'next/link';
import { useReservationStore } from '../store/reservationStore';

interface SuccessStepProps {
  reservationId: string;
}

export default function SuccessStep({ reservationId }: SuccessStepProps) {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const resetForm = useReservationStore(state => state.resetForm);
  
  // 예약 정보 로드
  useEffect(() => {
    const reservation = getReservationById(reservationId);
    if (reservation) {
      setReservation(reservation);
    }
  }, [reservationId]);
  
  // 예약 정보가 없으면 로딩 표시
  if (!reservation) {
    return (
      <div className="flex justify-center items-center py-10">
        <p>예약 정보를 불러오는 중...</p>
      </div>
    );
  }
  
  // 서비스와 스타일리스트 정보 찾기
  const service = SERVICES.find(s => s.id === reservation.serviceId);
  const stylist = STYLISTS.find(s => s.id === reservation.stylistId);
  
  // 날짜와 시간 포맷팅
  const date = formatReadableDate(reservation.date);
  const time = formatTime(reservation.time);
  
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>예약이 완료되었습니다</DialogTitle>
        </DialogHeader>
        <div className="py-4 text-center">
          예약 번호: <b>{reservationId}</b>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              setOpen(false);
              resetForm();
              setTimeout(() => {
                router.push('/');
              }, 200);
            }}
          >
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 