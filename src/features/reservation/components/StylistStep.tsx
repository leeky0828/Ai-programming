'use client';

import { STYLISTS } from '../constants/stylists';
import StylistCard from './StylistCard';
import { useReservationStore } from '../store/reservationStore';

export default function StylistStep() {
  const { selectedStylist, selectStylist, selectedService, errors } = useReservationStore();
  
  // 선택한 서비스에 맞는 스타일리스트 필터링
  const filteredStylists = selectedService
    ? STYLISTS.filter((stylist) => 
        stylist.specialties.includes(selectedService.name)
      )
    : STYLISTS;
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">스타일리스트 선택</h2>
        <p className="text-muted-foreground">
          원하시는 스타일리스트를 선택해주세요.
        </p>
        {errors.stylist && (
          <p className="text-destructive mt-2">{errors.stylist}</p>
        )}
      </div>
      
      {selectedService && filteredStylists.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            선택하신 시술에 맞는 스타일리스트가 없습니다.
            <br />
            다른 시술을 선택해주세요.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStylists.map((stylist) => (
            <StylistCard
              key={stylist.id}
              stylist={stylist}
              selected={selectedStylist?.id === stylist.id}
              onClick={() => selectStylist(stylist)}
            />
          ))}
        </div>
      )}
    </div>
  );
} 