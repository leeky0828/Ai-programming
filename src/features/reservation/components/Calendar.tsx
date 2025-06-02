'use client';

import { useState, useEffect } from 'react';
import { addMonths, format, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isAfter, isBefore } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  onSelectDate: (date: Date) => void;
  selectedDate?: Date;
  minDate?: Date;
  maxDate?: Date;
}

export default function Calendar({ onSelectDate, selectedDate, minDate = new Date(), maxDate }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [month, setMonth] = useState(startOfMonth(currentDate));

  // 월 이동
  const nextMonth = () => setMonth(addMonths(month, 1));
  const prevMonth = () => {
    const newMonth = subMonths(month, 1);
    if (isSameMonth(newMonth, minDate) || isAfter(newMonth, minDate)) {
      setMonth(newMonth);
    }
  };

  // 해당 월의 모든 날짜
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // 요일 배열
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  // 날짜 선택 핸들러
  const handleSelectDate = (date: Date) => {
    if (
      (minDate && isBefore(date, minDate)) ||
      (maxDate && isAfter(date, maxDate))
    ) {
      return;
    }
    onSelectDate(date);
  };

  // 현재 월의 시작 요일 (0: 일요일, 1: 월요일, ...)
  const firstDayOfMonth = monthStart.getDay();

  // 빈 셀 생성 (월 시작 전)
  const emptyCellsBefore = Array(firstDayOfMonth).fill(null);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={prevMonth}
          disabled={isSameMonth(month, minDate) || isBefore(month, minDate)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-medium">
          {format(month, 'yyyy년 M월', { locale: ko })}
        </h2>
        <Button 
          variant="outline" 
          size="icon"
          onClick={nextMonth}
          disabled={maxDate ? isSameMonth(month, maxDate) || isAfter(month, maxDate) : false}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day) => (
          <div key={day} className="text-center font-medium py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {emptyCellsBefore.map((_, i) => (
          <div key={`empty-before-${i}`} className="h-10" />
        ))}

        {monthDays.map((day) => {
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          const isDisabled =
            (minDate && isBefore(day, minDate)) ||
            (maxDate && isAfter(day, maxDate));

          return (
            <Button
              key={day.toString()}
              onClick={() => handleSelectDate(day)}
              disabled={isDisabled}
              variant="ghost"
              className={cn(
                'h-10 w-full rounded-md',
                isSelected && 'bg-primary text-primary-foreground hover:bg-primary/90',
                isToday(day) && !isSelected && 'border border-primary',
                isDisabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {format(day, 'd')}
            </Button>
          );
        })}
      </div>
    </div>
  );
} 