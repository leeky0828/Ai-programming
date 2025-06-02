import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * clsx와 tailwind-merge를 결합하여 클래스 이름을 효율적으로 병합하는 유틸 함수
 * @param {ClassValue[]} inputs - 병합할 클래스 이름들
 * @returns {string} 병합된 클래스 이름
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 주어진 범위 내의 난수를 생성
 * @param {number} min - 최소값
 * @param {number} max - 최대값
 * @returns {number} 생성된 난수
 */
export function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 주어진 배열을 무작위로 섞음
 * @param {T[]} array - 섞을 배열
 * @returns {T[]} 섞인 배열
 */
export function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * 주어진 문자열을 일정 길이로 제한하고 초과시 생략 부호 추가
 * @param {string} str - 원본 문자열
 * @param {number} n - 최대 길이
 * @returns {string} 제한된 문자열
 */
export function truncate(str: string, n: number): string {
  return str.length > n ? str.substring(0, n - 1) + "..." : str;
}

/**
 * 현재 URL이 프로덕션 환경인지 확인
 * @returns {boolean} 프로덕션 환경 여부
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/**
 * 객체에서 null 또는 undefined 값을 가진 프로퍼티 제거
 * @param {Record<string, any>} obj - 대상 객체
 * @returns {Record<string, any>} 정리된 객체
 */
export function removeEmptyValues<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      result[key as keyof T] = value;
    }
  });
  return result;
}

/**
 * 문자열이 이메일 형식인지 확인
 * @param {string} email - 확인할 이메일
 * @returns {boolean} 이메일 형식 여부
 */
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

/**
 * 문자열이 한국 전화번호 형식인지 확인
 * @param {string} phone - 확인할 전화번호
 * @returns {boolean} 전화번호 형식 여부
 */
export function isValidKoreanPhone(phone: string): boolean {
  const re = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
  return re.test(phone);
}

/**
 * 문자열을 슬러그 형식으로 변환
 * @param {string} text - 변환할 문자열
 * @returns {string} 슬러그 형식의 문자열
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

/**
 * 날짜를 'YYYY-MM-DD' 형식의 문자열로 변환
 * @param {Date} date - 변환할 날짜
 * @returns {string} 형식화된 날짜 문자열
 */
export function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
