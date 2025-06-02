'use client';

import { SERVICES } from '../constants/services';
import ServiceCard from './ServiceCard';
import { useReservationStore } from '../store/reservationStore';

export default function ServiceStep() {
  const { selectedService, selectService, errors } = useReservationStore();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">시술 선택</h2>
        <p className="text-muted-foreground">
          원하시는 시술을 선택해주세요.
        </p>
        {errors.service && (
          <p className="text-destructive mt-2">{errors.service}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVICES.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            selected={selectedService?.id === service.id}
            onClick={() => selectService(service)}
          />
        ))}
      </div>
    </div>
  );
} 