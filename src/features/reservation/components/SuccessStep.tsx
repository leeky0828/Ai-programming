'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatReadableDate, formatTime } from '../lib/datetime';
import { CheckCircle2 } from 'lucide-react';
import { Reservation } from '../lib/types';
import { getReservationById } from '../lib/storage';
import { SERVICES } from '../constants/services';
import { STYLISTS } from '../constants/stylists';
import Link from 'next/link';

interface SuccessStepProps {
  reservationId: string;
}

export default function SuccessStep({ reservationId }: SuccessStepProps) {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  
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
    <div className="max-w-md mx-auto py-10 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">예약이 완료되었습니다!</h1>
        <p className="text-muted-foreground">
          예약 정보는 아래에서 확인하실 수 있습니다.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>예약 정보</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">예약 번호</p>
            <p className="font-medium">{reservationId.slice(0, 8)}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">예약자</p>
            <p className="font-medium">{reservation.customerName}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">연락처</p>
            <p className="font-medium">{reservation.customerPhone}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">시술</p>
            <p className="font-medium">{service?.name}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">스타일리스트</p>
            <p className="font-medium">{stylist?.name}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">날짜 및 시간</p>
            <p className="font-medium">{date} {time}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">상태</p>
            <p className="font-medium">
              {reservation.status === 'pending' && '승인 대기중'}
              {reservation.status === 'confirmed' && '예약 확정'}
              {reservation.status === 'cancelled' && '예약 취소'}
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground text-center w-full mb-2">
            예약 취소는 미용실로 직접 연락 부탁드립니다.
          </p>
          
          <div className="flex space-x-2 w-full">
            <Button asChild className="w-full">
              <Link href="/my-reservations">내 예약 보기</Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link href="/">홈으로</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 