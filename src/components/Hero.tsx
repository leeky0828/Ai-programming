'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Calendar, Scissors, MapPin } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-b from-primary-foreground to-muted">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              스타일의 시작은<br />
              <span className="text-primary">HairNow</span>에서
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto md:mx-0">
              원하는 스타일을 쉽고 빠르게 예약하세요. 전화 없이 온라인으로 간편하게 미용실 예약이 가능합니다.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild size="lg">
                <Link href="/reservation">
                  <Calendar className="mr-2 h-5 w-5" />
                  지금 예약하기
                </Link>
              </Button>
              
              <Button variant="outline" asChild size="lg">
                <Link href="/my-reservations">
                  예약 확인하기
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://picsum.photos/id/26/800/600" 
                alt="헤어 스타일"
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* 부유 요소들 */}
            <div className="absolute -top-6 -left-6 bg-background p-4 rounded-lg shadow-lg hidden md:flex items-center">
              <Scissors className="h-5 w-5 mr-2 text-primary" />
              <span className="font-medium">전문 스타일리스트</span>
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-background p-4 rounded-lg shadow-lg hidden md:flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              <span className="font-medium">강남 중심 위치</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 