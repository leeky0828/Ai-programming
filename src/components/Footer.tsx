'use client';

import Link from 'next/link';
import { Scissors, Phone, Clock, MapPin, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-muted py-12 mt-auto">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Scissors className="h-6 w-6" />
              <span className="text-xl font-bold">HairNow</span>
            </div>
            <p className="text-muted-foreground text-sm">
              HairNow는 소규모 미용실을 위한 웹 기반 예약 서비스입니다.
              <br />
              고객은 온라인에서 간편하게 예약하고, 미용실은 로컬 데이터로 운영할 수 있습니다.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">바로가기</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  홈
                </Link>
              </li>
              <li>
                <Link href="/reservation" className="text-muted-foreground hover:text-foreground transition-colors">
                  예약하기
                </Link>
              </li>
              <li>
                <Link href="/my-reservations" className="text-muted-foreground hover:text-foreground transition-colors">
                  내 예약 확인
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">영업 시간</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">월-금: 10:00 - 20:00</p>
                  <p className="text-muted-foreground">토요일: 10:00 - 18:00</p>
                  <p className="text-muted-foreground">일요일: 휴무</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">연락처</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <Phone className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">02-123-4567</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  서울특별시 강남구 테헤란로 123 미용실빌딩 1층
                </span>
              </li>
              <li className="flex items-center space-x-2 mt-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} HairNow. 모든 권리 보유.</p>
        </div>
      </div>
    </footer>
  );
} 