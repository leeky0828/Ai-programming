'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import Calendar from './Calendar';
import TimeSlotPicker from './TimeSlotPicker';
import { useReservationStore } from '../store/reservationStore';
import { getAvailableTimeSlots } from '../lib/datetime';
import { TimeSlot } from '../lib/types';
import { getReservationsByDate } from '../lib/storage';

export default function DateTimeStep() {
  const { 
    selectedDate, 
    selectedTime, 
    selectedService, 
    selectedStylist,
    selectDate, 
    selectTime, 
    errors 
  } = useReservationStore();
  
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  
  // 날짜 선택 핸들러
  const handleDateSelect = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    selectDate(formattedDate);
  };
  
  // 선택한 날짜가 있으면 Date 객체로 변환
  const selectedDateObj = selectedDate ? new Date(selectedDate) : undefined;
  
  // 날짜가 선택되면 해당 날짜의 가용 시간 슬롯 계산
  useEffect(() => {
    if (!selectedDate || !selectedStylist || !selectedService) {
      setAvailableTimeSlots([]);
      return;
    }
    
    const existingReservations = getReservationsByDate(selectedDate);
    
    const timeSlots = getAvailableTimeSlots(
      selectedStylist,
      selectedService,
      selectedDate,
      existingReservations
    );
    
    setAvailableTimeSlots(timeSlots);
  }, [selectedDate, selectedStylist, selectedService]);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">날짜 및 시간 선택</h2>
        <p className="text-muted-foreground">
          예약하실 날짜와 시간을 선택해주세요.
        </p>
        {(errors.date || errors.time) && (
          <p className="text-destructive mt-2">{errors.date || errors.time}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">날짜 선택</h3>
          <Card>
            <CardContent className="pt-6">
              <Calendar 
                onSelectDate={handleDateSelect}
                selectedDate={selectedDateObj}
                minDate={new Date()}
              />
            </CardContent>
          </Card>
        </div>
        
        <div>
          {selectedDate ? (
            <TimeSlotPicker
              timeSlots={availableTimeSlots}
              selectedTime={selectedTime}
              onSelectTime={selectTime}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">
                먼저 날짜를 선택해주세요.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 