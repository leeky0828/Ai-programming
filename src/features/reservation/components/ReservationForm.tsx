'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ReservationStepper from './ReservationStepper';
import ServiceStep from './ServiceStep';
import StylistStep from './StylistStep';
import DateTimeStep from './DateTimeStep';
import CustomerInfoStep from './CustomerInfoStep';
import SuccessStep from './SuccessStep';
import { useReservationStore } from '../store/reservationStore';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const steps = [
  {
    title: '시술 선택',
    description: '원하는 시술을 선택하세요',
  },
  {
    title: '스타일리스트',
    description: '원하는 스타일리스트를 선택하세요',
  },
  {
    title: '날짜/시간',
    description: '원하는 날짜와 시간을 선택하세요',
  },
  {
    title: '고객 정보',
    description: '고객 정보를 입력하세요',
  },
];

export default function ReservationForm() {
  const { step, nextStep, prevStep, validateCurrentStep, submitReservation } = useReservationStore();
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 단계별 컴포넌트 렌더링
  const renderStep = () => {
    switch (step) {
      case 1:
        return <ServiceStep />;
      case 2:
        return <StylistStep />;
      case 3:
        return <DateTimeStep />;
      case 4:
        return <CustomerInfoStep />;
      case 5:
        return <SuccessStep reservationId={reservationId!} />;
      default:
        return <ServiceStep />;
    }
  };
  
  // 완료 버튼 클릭 핸들러
  const handleComplete = async () => {
    if (validateCurrentStep()) {
      setIsSubmitting(true);
      
      try {
        const id = await submitReservation();
        setReservationId(id);
        nextStep();
      } catch (error) {
        console.error('예약 중 오류가 발생했습니다:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto py-6">
      {step <= 4 && (
        <ReservationStepper currentStep={step} steps={steps} />
      )}
      
      <div className="mt-8">
        {renderStep()}
      </div>
      
      {step <= 4 && (
        <div className="mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            이전
          </Button>
          
          {step < 4 ? (
            <Button onClick={nextStep} className="flex items-center">
              다음
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleComplete}
              disabled={isSubmitting}
              className="flex items-center"
            >
              {isSubmitting ? '예약 중...' : '예약 완료'}
              {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          )}
        </div>
      )}
    </div>
  );
} 