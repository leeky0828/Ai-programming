'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Service } from '../constants/services';
import { Clock, Scissors } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  selected?: boolean;
  onClick?: () => void;
}

export default function ServiceCard({ service, selected = false, onClick }: ServiceCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:border-primary hover:shadow-md',
        selected && 'border-2 border-primary'
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{service.name}</CardTitle>
        <CardDescription>{service.description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center mb-2">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {service.durationMinutes}분 소요
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 border-t flex justify-between items-center">
        <div className="flex items-center">
          <Scissors className="h-4 w-4 mr-2" />
          <span className="font-semibold">{service.price.toLocaleString()}원</span>
        </div>
      </CardFooter>
    </Card>
  );
} 