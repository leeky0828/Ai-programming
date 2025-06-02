'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getReservations, deleteReservation } from '../lib/storage';
import { Reservation } from '../lib/types';
import { formatReadableDate, formatTime } from '../lib/datetime';
import { SERVICES } from '../constants/services';
import { STYLISTS } from '../constants/stylists';
import { Calendar, Clock, Search, Trash2, XCircle, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ReviewForm from './ReviewForm';

export default function MyReservationList() {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  
  // 예약 데이터 로드
  const loadReservations = () => {
    if (!customerName || !customerPhone) {
      setReservations([]);
      return;
    }
    
    const allReservations = getReservations();
    const myReservations = allReservations.filter(
      r => 
        r.customerName === customerName && 
        r.customerPhone === customerPhone
    );
    
    setReservations(myReservations);
    setIsSearching(false);
  };
  
  // 예약 취소 (삭제)
  const cancelReservation = (id: string) => {
    if (window.confirm('정말로 이 예약을 취소하시겠습니까?')) {
      deleteReservation(id);
      
      // 목록 업데이트
      setReservations(prev => prev.filter(r => r.id !== id));
    }
  };
  
  // 예약 검색
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    loadReservations();
  };
  
  // 전화번호 입력 핸들러 (자동 하이픈 추가)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 전화번호 포맷팅 (숫자와 하이픈만 허용)
    const value = e.target.value.replace(/[^\d-]/g, '');
    
    // 자동으로 하이픈(-) 추가
    let formattedPhone = value;
    if (value.length === 11 && !value.includes('-')) {
      formattedPhone = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7)}`;
    } else if (value.length === 10 && !value.includes('-')) {
      formattedPhone = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
    }
    
    setCustomerPhone(formattedPhone);
  };
  
  // 리뷰 대화상자 열기
  const openReviewDialog = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setReviewDialogOpen(true);
  };
  
  // 리뷰 작성 완료 후
  const handleReviewSuccess = () => {
    // 목록 다시 로드
    loadReservations();
    // 약간 딜레이 후 대화상자 닫기
    setTimeout(() => {
      setReviewDialogOpen(false);
      setSelectedReservation(null);
    }, 2000);
  };
  
  // 상태 배지 렌더링
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">승인 대기중</Badge>;
      case 'confirmed':
        return <Badge variant="default">예약 확정</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">예약 취소</Badge>;
      default:
        return null;
    }
  };
  
  // 서비스와 스타일리스트 정보 조회
  const getServiceName = (serviceId: string) => {
    const service = SERVICES.find(s => s.id === serviceId);
    return service?.name || '알 수 없음';
  };
  
  const getStylistName = (stylistId: string) => {
    const stylist = STYLISTS.find(s => s.id === stylistId);
    return stylist?.name || '알 수 없음';
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">내 예약 조회</h1>
      
      <form onSubmit={handleSearch} className="space-y-4">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>예약 조회</CardTitle>
            <CardDescription>
              예약 시 입력하신 이름과 전화번호로 조회하세요.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                placeholder="예약자 이름"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">전화번호</Label>
              <Input
                id="phone"
                placeholder="010-1234-5678"
                value={customerPhone}
                onChange={handlePhoneChange}
                required
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSearching}>
              {isSearching ? '조회 중...' : '예약 조회'}
            </Button>
          </CardFooter>
        </Card>
      </form>
      
      {isSearching && reservations.length === 0 && (
        <div className="text-center py-8">
          <p>예약 정보가 없습니다.</p>
        </div>
      )}
      
      {reservations.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">예약 목록</h2>
          <div className="space-y-4">
            {reservations.map((reservation) => {
              // 서비스와 스타일리스트 정보 조회
              const service = SERVICES.find(s => s.id === reservation.serviceId);
              const stylist = STYLISTS.find(s => s.id === reservation.stylistId);
              
              return (
                <Card key={reservation.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{service?.name || '알 수 없는 서비스'}</CardTitle>
                        <CardDescription>
                          스타일리스트: {stylist?.name || '알 수 없음'}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        {reservation.status === 'confirmed' && (
                          <Badge variant="default">예약 확정</Badge>
                        )}
                        {reservation.status === 'pending' && (
                          <Badge variant="outline">확인 대기중</Badge>
                        )}
                        {reservation.status === 'cancelled' && (
                          <Badge variant="destructive">예약 취소됨</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{formatReadableDate(reservation.date)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{formatTime(reservation.time)}</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">예약자 정보</p>
                        <p>{reservation.customerName}</p>
                        <p className="text-sm">{reservation.customerPhone}</p>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <div className="flex gap-2 w-full">
                      {reservation.status === 'confirmed' && (
                        <Button
                          variant={reservation.hasReview ? "outline" : "default"}
                          className="flex-1"
                          onClick={() => openReviewDialog(reservation)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          {reservation.hasReview ? '리뷰 수정' : '리뷰 작성'}
                        </Button>
                      )}
                      
                      {reservation.status !== 'cancelled' && (
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => cancelReservation(reservation.id)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          취소
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      )}
      
      {/* 리뷰 작성 대화상자 */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>리뷰 작성</DialogTitle>
          </DialogHeader>
          {selectedReservation && (
            <ReviewForm 
              reservation={selectedReservation} 
              onSuccess={handleReviewSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 