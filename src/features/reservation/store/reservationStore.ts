'use client';

import { create } from 'zustand';
import { Service } from '../constants/services';
import { Stylist } from '../constants/stylists';
import { ReservationTime, ReservationFormData } from '../lib/types';
import { saveReservation } from '../lib/storage';
import { v4 as uuidv4 } from 'uuid';

interface ReservationState {
  step: number;
  selectedService: Service | null;
  selectedStylist: Stylist | null;
  selectedDate: string | null;
  selectedTime: ReservationTime | null;
  customerName: string;
  customerPhone: string;
  errors: {
    [key: string]: string;
  };
  
  // 액션
  selectService: (service: Service) => void;
  selectStylist: (stylist: Stylist) => void;
  selectDate: (date: string) => void;
  selectTime: (time: ReservationTime) => void;
  setCustomerInfo: (name: string, phone: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  validateCurrentStep: () => boolean;
  submitReservation: () => Promise<string>;
  resetForm: () => void;
}

export const useReservationStore = create<ReservationState>((set, get) => ({
  step: 1,
  selectedService: null,
  selectedStylist: null,
  selectedDate: null,
  selectedTime: null,
  customerName: '',
  customerPhone: '',
  errors: {},
  
  selectService: (service) => set({ selectedService: service }),
  
  selectStylist: (stylist) => set({ selectedStylist: stylist }),
  
  selectDate: (date) => set({ selectedDate: date }),
  
  selectTime: (time) => set({ selectedTime: time }),
  
  setCustomerInfo: (name, phone) => set({ customerName: name, customerPhone: phone }),
  
  nextStep: () => {
    const { step, validateCurrentStep } = get();
    
    if (validateCurrentStep()) {
      set({ step: step + 1 });
    }
  },
  
  prevStep: () => {
    const { step } = get();
    if (step > 1) {
      set({ step: step - 1 });
    }
  },
  
  validateCurrentStep: () => {
    const { step, selectedService, selectedStylist, selectedDate, selectedTime, customerName, customerPhone } = get();
    let newErrors: {[key: string]: string} = {};
    let isValid = true;
    
    switch (step) {
      case 1:
        if (!selectedService) {
          newErrors.service = '시술을 선택해주세요.';
          isValid = false;
        }
        break;
      case 2:
        if (!selectedStylist) {
          newErrors.stylist = '스타일리스트를 선택해주세요.';
          isValid = false;
        }
        break;
      case 3:
        if (!selectedDate) {
          newErrors.date = '날짜를 선택해주세요.';
          isValid = false;
        }
        if (!selectedTime) {
          newErrors.time = '시간을 선택해주세요.';
          isValid = false;
        }
        break;
      case 4:
        if (!customerName || customerName.trim() === '') {
          newErrors.name = '이름을 입력해주세요.';
          isValid = false;
        }
        if (!customerPhone || !/^\d{3}-\d{3,4}-\d{4}$/.test(customerPhone)) {
          newErrors.phone = '전화번호를 형식에 맞게 입력해주세요. (예: 010-1234-5678)';
          isValid = false;
        }
        break;
    }
    
    set({ errors: newErrors });
    return isValid;
  },
  
  submitReservation: async () => {
    const { selectedService, selectedStylist, selectedDate, selectedTime, customerName, customerPhone } = get();
    
    if (!selectedService || !selectedStylist || !selectedDate || !selectedTime || !customerName || !customerPhone) {
      throw new Error('예약 정보가 모두 입력되지 않았습니다.');
    }
    
    const reservationId = uuidv4();
    
    const newReservation = {
      id: reservationId,
      customerName,
      customerPhone,
      serviceId: selectedService.id,
      stylistId: selectedStylist.id,
      date: selectedDate,
      time: selectedTime,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    try {
      saveReservation(newReservation as any);
      return reservationId;
    } catch (error) {
      if (error instanceof Error) {
        set({ errors: { submit: error.message } });
      } else {
        set({ errors: { submit: '예약 중 오류가 발생했습니다.' } });
      }
      throw error;
    }
  },
  
  resetForm: () => set({
    step: 1,
    selectedService: null,
    selectedStylist: null,
    selectedDate: null,
    selectedTime: null,
    customerName: '',
    customerPhone: '',
    errors: {},
  }),
})); 