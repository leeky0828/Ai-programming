'use client';

import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReservationStepperProps {
  currentStep: number;
  steps: { title: string; description: string }[];
}

export default function ReservationStepper({ currentStep, steps }: ReservationStepperProps) {
  return (
    <div className="w-full py-4">
      <div className="flex flex-col md:flex-row justify-between">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className={cn(
              'flex items-start md:flex-col md:items-center text-center mb-8 md:mb-0',
              'relative w-full'
            )}
          >
            <div
              className={cn(
                'flex items-center justify-center',
                'relative z-10'
              )}
            >
              <div
                className={cn(
                  'w-10 h-10 flex items-center justify-center rounded-full',
                  currentStep > index + 1
                    ? 'bg-primary text-primary-foreground'
                    : currentStep === index + 1
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {currentStep > index + 1 ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
            </div>
            
            {/* 연결선 */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'hidden md:block absolute top-5 left-1/2 right-0 h-0.5',
                  currentStep > index + 1
                    ? 'bg-primary'
                    : 'bg-border'
                )}
              />
            )}
            
            <div className="ml-4 md:ml-0 md:mt-2">
              <p
                className={cn(
                  'font-medium',
                  currentStep >= index + 1
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {step.title}
              </p>
              <p className="text-sm text-muted-foreground hidden md:block">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 