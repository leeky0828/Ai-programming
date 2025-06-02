'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SERVICES } from '@/features/reservation/constants/services';
import { STYLISTS } from '@/features/reservation/constants/stylists';
import { Clock, Scissors, Star, Users } from 'lucide-react';
import Link from 'next/link';

export default function Services() {
  // 표시할 서비스 수 제한
  const displayedServices = SERVICES.slice(0, 3);
  
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container">
        {/* 섹션 헤더 */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            전문 헤어 서비스
          </h2>
          <p className="text-muted-foreground text-lg">
            HairNow는 다양한 헤어 스타일링 서비스를 제공합니다.
            전문 스타일리스트의 손길로 원하는 스타일을 연출해보세요.
          </p>
        </div>
        
        {/* 서비스 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedServices.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center mb-4">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {service.durationMinutes}분 소요
                  </span>
                </div>
                
                <div className="flex items-center">
                  <Scissors className="h-4 w-4 mr-2" />
                  <span className="font-semibold">{service.price.toLocaleString()}원</span>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/reservation">예약하기</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-background rounded-lg p-8 text-center shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">{STYLISTS.length}+</h3>
            <p className="text-muted-foreground">전문 스타일리스트</p>
          </div>
          
          <div className="bg-background rounded-lg p-8 text-center shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Scissors className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">{SERVICES.length}+</h3>
            <p className="text-muted-foreground">다양한 헤어 서비스</p>
          </div>
          
          <div className="bg-background rounded-lg p-8 text-center shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">98%</h3>
            <p className="text-muted-foreground">고객 만족도</p>
          </div>
        </div>
        
        {/* CTA 버튼 */}
        <div className="text-center mt-16">
          <Button asChild size="lg">
            <Link href="/reservation">
              모든 서비스 보기 및 예약하기
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
} 