'use client';

import { Reservation, Review } from './types';
import { Stylist } from '../constants/stylists';

const RESERVATIONS_KEY = 'hairnow_reservations';
const ADMIN_AUTH_KEY = 'hairnow_admin_auth';
const ADMIN_ACCOUNTS_KEY = 'hairnow_admin_accounts';
const REVIEWS_KEY = 'hairnow_reviews';
const STYLISTS_KEY = 'hairnow_stylists';

export interface AdminAccount {
  username: string;
  password: string;
  name: string;
  createdAt: string;
}

export const getReservations = (): Reservation[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const reservationsJson = localStorage.getItem(RESERVATIONS_KEY);
  if (!reservationsJson) {
    return [];
  }
  
  try {
    return JSON.parse(reservationsJson);
  } catch (error) {
    console.error('Failed to parse reservations:', error);
    return [];
  }
};

export const saveReservation = (reservation: Reservation): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  const reservations = getReservations();
  
  // 하루 최대 3건까지만 허용
  const sameDate = reservations.filter(
    (r) => r.date === reservation.date && r.status !== 'cancelled'
  );
  
  if (sameDate.length >= 3) {
    throw new Error('하루에 최대 3건의 예약만 가능합니다.');
  }
  
  const newReservations = [...reservations, reservation];
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(newReservations));
};

export const updateReservation = (reservationId: string, updates: Partial<Reservation>): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  const reservations = getReservations();
  const updatedReservations = reservations.map((reservation) =>
    reservation.id === reservationId
      ? { ...reservation, ...updates }
      : reservation
  );
  
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(updatedReservations));
};

export const deleteReservation = (reservationId: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  const reservations = getReservations();
  const filteredReservations = reservations.filter(
    (reservation) => reservation.id !== reservationId
  );
  
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(filteredReservations));
};

export const getReservationsByDate = (date: string): Reservation[] => {
  const reservations = getReservations();
  return reservations.filter((reservation) => reservation.date === date);
};

export const getReservationById = (id: string): Reservation | undefined => {
  const reservations = getReservations();
  return reservations.find((reservation) => reservation.id === id);
};

export const checkAdminAuth = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
};

export const loginAdmin = (username: string, password: string): boolean => {
  // 기본 관리자 계정 추가 (첫 실행 시)
  if (getAdminAccounts().length === 0) {
    const defaultAdmin: AdminAccount = {
      username: 'admin',
      password: 'hairnow123',
      name: '관리자',
      createdAt: new Date().toISOString()
    };
    saveAdminAccount(defaultAdmin);
  }
  
  // 계정 확인
  const accounts = getAdminAccounts();
  const account = accounts.find(acc => acc.username === username && acc.password === password);
  
  if (account) {
    localStorage.setItem(ADMIN_AUTH_KEY, 'true');
    // 현재 로그인한 관리자 정보 저장
    localStorage.setItem('current_admin', JSON.stringify({
      username: account.username,
      name: account.name
    }));
    return true;
  }
  
  return false;
};

export const logoutAdmin = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.removeItem(ADMIN_AUTH_KEY);
  localStorage.removeItem('current_admin');
};

// 관리자 계정 관리 함수
export const getAdminAccounts = (): AdminAccount[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const accountsJson = localStorage.getItem(ADMIN_ACCOUNTS_KEY);
  if (!accountsJson) {
    return [];
  }
  
  try {
    return JSON.parse(accountsJson);
  } catch (error) {
    console.error('Failed to parse admin accounts:', error);
    return [];
  }
};

export const saveAdminAccount = (account: AdminAccount): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  const accounts = getAdminAccounts();
  
  // 중복 아이디 체크
  const existingAccount = accounts.find(acc => acc.username === account.username);
  if (existingAccount) {
    throw new Error('이미 사용 중인 아이디입니다.');
  }
  
  const updatedAccounts = [...accounts, account];
  localStorage.setItem(ADMIN_ACCOUNTS_KEY, JSON.stringify(updatedAccounts));
};

export const getCurrentAdmin = (): { username: string; name: string } | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const currentAdminJson = localStorage.getItem('current_admin');
  if (!currentAdminJson) {
    return null;
  }
  
  try {
    return JSON.parse(currentAdminJson);
  } catch (error) {
    console.error('Failed to parse current admin:', error);
    return null;
  }
};

// 리뷰 관련 함수
export const getReviews = (): Review[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const reviewsJson = localStorage.getItem(REVIEWS_KEY);
  if (!reviewsJson) {
    return [];
  }
  
  try {
    return JSON.parse(reviewsJson);
  } catch (error) {
    console.error('Failed to parse reviews:', error);
    return [];
  }
};

export const saveReview = (review: Review): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  const reviews = getReviews();
  
  // 같은 예약에 대한 리뷰가 이미 있는지 확인
  const existingReviewIndex = reviews.findIndex(r => r.reservationId === review.reservationId);
  
  // 리뷰 저장하고 예약에 hasReview 플래그 추가
  if (existingReviewIndex >= 0) {
    // 기존 리뷰 업데이트
    reviews[existingReviewIndex] = { ...review };
  } else {
    // 새 리뷰 추가
    reviews.push(review);
  }
  
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  
  // 예약 데이터에 리뷰 여부 표시
  const reservation = getReservationById(review.reservationId);
  if (reservation) {
    updateReservation(review.reservationId, { hasReview: true });
  }
};

export const getReviewsByServiceId = (serviceId: string): Review[] => {
  const reviews = getReviews();
  return reviews.filter(review => review.serviceId === serviceId);
};

export const getReviewsByStylistId = (stylistId: string): Review[] => {
  const reviews = getReviews();
  return reviews.filter(review => review.stylistId === stylistId);
};

export const getReviewByReservationId = (reservationId: string): Review | undefined => {
  const reviews = getReviews();
  return reviews.find(review => review.reservationId === reservationId);
};

export const deleteReview = (reviewId: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  const reviews = getReviews();
  const review = reviews.find(r => r.id === reviewId);
  
  if (review) {
    // 예약에서 리뷰 플래그 제거
    const reservation = getReservationById(review.reservationId);
    if (reservation) {
      updateReservation(review.reservationId, { hasReview: false });
    }
    
    // 리뷰 삭제
    const filteredReviews = reviews.filter(r => r.id !== reviewId);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(filteredReviews));
  }
};

// 스타일리스트 관련 함수
export const getStylists = (): Stylist[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const stylistsJson = localStorage.getItem(STYLISTS_KEY);
  if (!stylistsJson) {
    // 기본 스타일리스트 목록 가져오기 (처음에는 constants에서 가져옴)
    const { STYLISTS } = require('../constants/stylists');
    localStorage.setItem(STYLISTS_KEY, JSON.stringify(STYLISTS));
    return STYLISTS;
  }
  
  try {
    return JSON.parse(stylistsJson);
  } catch (error) {
    console.error('Failed to parse stylists:', error);
    return [];
  }
};

export const saveStylist = (stylist: Stylist): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  const stylists = getStylists();
  
  // 기존 스타일리스트 확인
  const existingIndex = stylists.findIndex(s => s.id === stylist.id);
  
  if (existingIndex >= 0) {
    // 기존 스타일리스트 업데이트
    stylists[existingIndex] = { ...stylist };
  } else {
    // 새 스타일리스트 추가
    stylists.push(stylist);
  }
  
  localStorage.setItem(STYLISTS_KEY, JSON.stringify(stylists));
};

export const deleteStylist = (stylistId: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  const stylists = getStylists();
  const filteredStylists = stylists.filter(s => s.id !== stylistId);
  localStorage.setItem(STYLISTS_KEY, JSON.stringify(filteredStylists));
}; 