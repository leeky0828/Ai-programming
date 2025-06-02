'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ReviewList from '@/features/reservation/components/ReviewList';
import { SERVICES } from '@/features/reservation/constants/services';
import { STYLISTS } from '@/features/reservation/constants/stylists';

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'services' | 'stylists'>('all');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedStylist, setSelectedStylist] = useState<string | null>(null);
  
  return (
    <div className="container py-10 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">고객 리뷰</h1>
        <p className="text-muted-foreground">
          HairNow 고객님들의 솔직한 리뷰를 확인해보세요
        </p>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-center mb-4">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger 
              value="all" 
              onClick={() => {
                setActiveTab('all');
                setSelectedService(null);
                setSelectedStylist(null);
              }}
            >
              전체 리뷰
            </TabsTrigger>
            <TabsTrigger 
              value="services" 
              onClick={() => {
                setActiveTab('services');
                setSelectedStylist(null);
              }}
            >
              시술별
            </TabsTrigger>
            <TabsTrigger 
              value="stylists" 
              onClick={() => {
                setActiveTab('stylists');
                setSelectedService(null);
              }}
            >
              스타일리스트별
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all">
          <ReviewList />
        </TabsContent>
        
        <TabsContent value="services">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {SERVICES.map((service) => (
              <Card 
                key={service.id}
                className={`cursor-pointer transition-all ${
                  selectedService === service.id 
                    ? 'border-primary ring-2 ring-primary ring-opacity-50' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedService(
                  selectedService === service.id ? null : service.id
                )}
              >
                <CardHeader className="pb-2">
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription>
                    {service.description.split(' ').slice(0, 10).join(' ')}
                    {service.description.split(' ').length > 10 ? '...' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {service.price.toLocaleString()}원
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {selectedService ? (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">
                {SERVICES.find(s => s.id === selectedService)?.name} 리뷰
              </h2>
              <ReviewList serviceId={selectedService} />
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>위에서 시술을 선택하면 관련 리뷰를 볼 수 있습니다.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="stylists">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {STYLISTS.map((stylist) => (
              <Card 
                key={stylist.id}
                className={`cursor-pointer transition-all ${
                  selectedStylist === stylist.id 
                    ? 'border-primary ring-2 ring-primary ring-opacity-50' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedStylist(
                  selectedStylist === stylist.id ? null : stylist.id
                )}
              >
                <CardHeader className="pb-2">
                  <div className="flex space-x-4 items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img
                        src={stylist.profileImage}
                        alt={stylist.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle>{stylist.name}</CardTitle>
                      <CardDescription>
                        {stylist.position} | 경력 {stylist.experience}년
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    전문 분야: {stylist.specialties.join(', ')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {selectedStylist ? (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">
                {STYLISTS.find(s => s.id === selectedStylist)?.name} 디자이너 리뷰
              </h2>
              <ReviewList stylistId={selectedStylist} />
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>위에서 스타일리스트를 선택하면 관련 리뷰를 볼 수 있습니다.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 