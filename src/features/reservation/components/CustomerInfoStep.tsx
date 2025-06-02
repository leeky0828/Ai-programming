'use client';

import { useState } from 'react';
import { useReservationStore } from '../store/reservationStore';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatReadableDate, formatTime } from '../lib/datetime';
import { SERVICES } from '../constants/services';
import { STYLISTS } from '../constants/stylists';

export default function CustomerInfoStep() {
  const {
    customerName,
    customerPhone,
    selectedService,
    selectedStylist,
    selectedDate,
    selectedTime,
    setCustomerInfo,
    errors,
  } = useReservationStore();
  
  // 현재 입력된 이름과 번호로 상태를 관리
  const [name, setName] = useState(customerName);
  const [phone, setPhone] = useState(customerPhone);
  
  // 이름 변경 핸들러
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setCustomerInfo(e.target.value, phone);
  };
  
  // 전화번호 변경 핸들러
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
    
    setPhone(formattedPhone);
    setCustomerInfo(name, formattedPhone);
  };
  
  // 서비스와 스타일리스트 정보 조회
  const service = selectedService
    ? selectedService
    : { name: '', price: 0 };
  
  const stylist = selectedStylist
    ? selectedStylist
    : { name: '' };
  
  // 날짜와 시간 포맷팅
  const date = selectedDate
    ? formatReadableDate(selectedDate)
    : '';
  
  const time = selectedTime
    ? formatTime(selectedTime)
    : '';
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">예약 정보 확인</h2>
        <p className="text-muted-foreground">
          예약 정보를 확인하고 고객 정보를 입력해주세요.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">예약 정보</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">시술</p>
                <p className="font-medium">{service.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">가격</p>
                <p className="font-medium">{service.price.toLocaleString()}원</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">스타일리스트</p>
                <p className="font-medium">{stylist.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">날짜 및 시간</p>
                <p className="font-medium">{date} {time}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">고객 정보 입력</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  placeholder="홍길동"
                  value={name}
                  onChange={handleNameChange}
                />
                {errors.name && (
                  <p className="text-destructive text-sm">{errors.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">연락처</Label>
                <Input
                  id="phone"
                  placeholder="010-1234-5678"
                  value={phone}
                  onChange={handlePhoneChange}
                />
                {errors.phone && (
                  <p className="text-destructive text-sm">{errors.phone}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {errors.submit && (
        <p className="text-destructive text-center">{errors.submit}</p>
      )}
    </div>
  );
} 