'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ReservationTime, TimeSlot } from '../lib/types';
import { formatTime } from '../lib/datetime';

interface TimeSlotPickerProps {
  timeSlots: TimeSlot[];
  onSelectTime: (time: ReservationTime) => void;
  selectedTime?: ReservationTime;
}

export default function TimeSlotPicker({
  timeSlots,
  onSelectTime,
  selectedTime,
}: TimeSlotPickerProps) {
  const isSelected = (slot: TimeSlot) => {
    if (!selectedTime) return false;
    return (
      slot.hour === selectedTime.hour && slot.minute === selectedTime.minute
    );
  };

  // 시간대 그룹화 (09:00, 09:30, 10:00 등)
  const groupedByHour: { [hour: number]: TimeSlot[] } = {};
  
  timeSlots.forEach((slot) => {
    if (!groupedByHour[slot.hour]) {
      groupedByHour[slot.hour] = [];
    }
    groupedByHour[slot.hour].push(slot);
  });

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-4">시간 선택</h3>
      
      {Object.keys(groupedByHour).length === 0 ? (
        <div className="text-muted-foreground text-center py-8">
          이 날짜에 가능한 시간이 없습니다.
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByHour).map(([hour, slots]) => (
            <div key={hour} className="space-y-2">
              <div className="font-medium">{hour}시</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {slots.map((slot) => (
                  <Button
                    key={`${slot.hour}-${slot.minute}`}
                    onClick={() => slot.available && onSelectTime(slot)}
                    disabled={!slot.available}
                    variant={isSelected(slot) ? 'default' : 'outline'}
                    className={cn(
                      'justify-center py-2',
                      !slot.available && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {formatTime(slot)}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 