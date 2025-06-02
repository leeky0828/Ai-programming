'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Stylist } from '../constants/stylists';
import { Calendar, Clock } from 'lucide-react';

interface StylistCardProps {
  stylist: Stylist;
  selected?: boolean;
  onClick?: () => void;
}

export default function StylistCard({ stylist, selected = false, onClick }: StylistCardProps) {
  // 근무 시간 포맷팅
  const workHours = `${stylist.availability.start} ~ ${stylist.availability.end}`;
  
  // 휴무일 포맷팅
  const getDayName = (day: number) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[day];
  };
  
  const daysOff = stylist.availability.daysOff
    .map(getDayName)
    .join(', ');
  
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:border-primary hover:shadow-md',
        selected && 'border-2 border-primary'
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={stylist.profileImage} alt={stylist.name} />
          <AvatarFallback>{stylist.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl">{stylist.name}</CardTitle>
          <CardDescription>{stylist.position}</CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-1 mb-2">
          {stylist.specialties.map((specialty) => (
            <Badge key={specialty} variant="secondary">
              {specialty}
            </Badge>
          ))}
        </div>
        
        <div className="text-sm text-muted-foreground">
          경력 {stylist.experience}년
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 border-t flex flex-col items-start gap-1">
        <div className="flex items-center w-full">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm">{workHours}</span>
        </div>
        <div className="flex items-center w-full">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm">휴무일: {daysOff}</span>
        </div>
      </CardFooter>
    </Card>
  );
} 