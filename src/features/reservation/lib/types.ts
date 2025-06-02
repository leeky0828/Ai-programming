import { Service } from "../constants/services";
import { Stylist } from "../constants/stylists";

export interface ReservationTime {
  hour: number;
  minute: number;
}

export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  stylistId: string;
  date: string; // 'YYYY-MM-DD' 형식
  time: ReservationTime;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  // 관리자 관련 필드
  confirmationNote?: string;
  confirmedBy?: string;
  confirmedAt?: string;
  cancelledBy?: string;
  cancelledAt?: string;
  // 리뷰 관련 필드
  hasReview?: boolean;
}

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface TimeSlot {
  hour: number;
  minute: number;
  available: boolean;
}

export interface AvailableTimeSlot {
  stylist: Stylist;
  service: Service;
  date: string;
  timeSlots: TimeSlot[];
}

export interface ReservationFormData {
  customerName: string;
  customerPhone: string;
  serviceId: string;
  stylistId: string;
  date: string;
  time: ReservationTime;
}

export interface Review {
  id: string;
  reservationId: string;
  customerName: string;
  stylistId: string;
  serviceId: string;
  rating: number; // 1-5 별점
  content: string;
  images?: string[]; // 이미지 URL 배열 (선택사항)
  createdAt: string;
} 