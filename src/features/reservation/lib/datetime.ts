'use client';

import { format, addDays, parse, isAfter, isBefore, isEqual, isToday } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Reservation, ReservationTime, TimeSlot } from './types';
import { Stylist } from '../constants/stylists';
import { Service } from '../constants/services';
import { getReservationsByDate } from './storage';

// 날짜 포맷팅
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
};

// 사람이 읽기 쉬운 날짜 포맷
export const formatReadableDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'yyyy년 M월 d일 (E)', { locale: ko });
};

// 시간 포맷팅
export const formatTime = (time: ReservationTime): string => {
  return `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
};

// 현재 날짜로부터 2주간의 날짜 리스트 생성
export const getDateList = (startDate: Date = new Date()): Date[] => {
  const dates: Date[] = [];
  
  for (let i = 0; i < 14; i++) {
    dates.push(addDays(startDate, i));
  }
  
  return dates;
};

// 스타일리스트의 가용 시간 슬롯 계산
export const getAvailableTimeSlots = (
  stylist: Stylist,
  service: Service,
  date: string,
  existingReservations: Reservation[] = []
): TimeSlot[] => {
  const dateObj = new Date(date);
  const dayOfWeek = dateObj.getDay();
  
  // 스타일리스트 휴무일 체크
  if (stylist.availability.daysOff.includes(dayOfWeek)) {
    return [];
  }
  
  const startTime = parse(stylist.availability.start, 'HH:mm', new Date());
  const endTime = parse(stylist.availability.end, 'HH:mm', new Date());
  
  const startHour = startTime.getHours();
  const endHour = endTime.getHours();
  
  const timeSlots: TimeSlot[] = [];
  
  // 시간당 2개의 슬롯 (30분 간격)
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute of [0, 30]) {
      const slotTime = new Date();
      slotTime.setHours(hour, minute, 0, 0);
      
      // 오늘이면서 현재 시간보다 이전인 슬롯은 제외
      if (isToday(dateObj) && isBefore(slotTime, new Date())) {
        continue;
      }
      
      // 해당 시간에 이미 예약이 있는지 확인
      const isBooked = existingReservations.some((reservation) => {
        if (reservation.stylistId !== stylist.id || reservation.date !== date) {
          return false;
        }
        
        const reservationHour = reservation.time.hour;
        const reservationMinute = reservation.time.minute;
        
        // 예약의 시작 시간
        const reservationStart = new Date();
        reservationStart.setHours(reservationHour, reservationMinute, 0, 0);
        
        // 예약의 종료 시간 (서비스 시간 더함)
        const reservationEnd = new Date(reservationStart);
        reservationEnd.setMinutes(
          reservationStart.getMinutes() + service.durationMinutes
        );
        
        // 현재 슬롯의 종료 시간
        const slotEnd = new Date(slotTime);
        slotEnd.setMinutes(slotTime.getMinutes() + service.durationMinutes);
        
        // 예약 시간과 겹치는지 확인
        const startsBeforeSlotEnds = isBefore(reservationStart, slotEnd) || isEqual(reservationStart, slotEnd);
        const endsAfterSlotStarts = isAfter(reservationEnd, slotTime) || isEqual(reservationEnd, slotTime);
        
        return startsBeforeSlotEnds && endsAfterSlotStarts;
      });
      
      const slotEnd = new Date(slotTime);
      slotEnd.setMinutes(slotTime.getMinutes() + service.durationMinutes);
      
      // 서비스 시간이 영업 종료 시간을 넘어가면 슬롯 제외
      const exceedsBusinessHours = isAfter(slotEnd, endTime);
      
      timeSlots.push({
        hour,
        minute,
        available: !isBooked && !exceedsBusinessHours,
      });
    }
  }
  
  return timeSlots;
};

// 특정 날짜의 모든 스타일리스트에 대한 가용 시간 슬롯 계산
export const getAvailableTimeSlotsForDate = (
  stylists: Stylist[],
  service: Service,
  date: string
): Map<string, TimeSlot[]> => {
  const result = new Map<string, TimeSlot[]>();
  const existingReservations = getReservationsByDate(date);
  
  for (const stylist of stylists) {
    const timeSlots = getAvailableTimeSlots(
      stylist,
      service,
      date,
      existingReservations
    );
    result.set(stylist.id, timeSlots);
  }
  
  return result;
}; 