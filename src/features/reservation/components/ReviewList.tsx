'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rating } from '@/components/ui/rating';
import { Badge } from '@/components/ui/badge';
import { SERVICES } from '../constants/services';
import { STYLISTS } from '../constants/stylists';
import { getReviews, getReviewsByStylistId, getReviewsByServiceId } from '../lib/storage';
import { Review } from '../lib/types';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MessageSquare, ThumbsUp, Image as ImageIcon } from 'lucide-react';

interface ReviewListProps {
  serviceId?: string;
  stylistId?: string;
  limit?: number;
}

export default function ReviewList({ serviceId, stylistId, limit }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // 리뷰 데이터 로드
  useEffect(() => {
    let reviewData: Review[] = [];
    
    if (serviceId) {
      reviewData = getReviewsByServiceId(serviceId);
    } else if (stylistId) {
      reviewData = getReviewsByStylistId(stylistId);
    } else {
      reviewData = getReviews();
    }
    
    // 최신순으로 정렬
    reviewData.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // 개수 제한
    if (limit && reviewData.length > limit) {
      reviewData = reviewData.slice(0, limit);
    }
    
    setReviews(reviewData);
  }, [serviceId, stylistId, limit]);
  
  // 서비스 이름 조회
  const getServiceName = (id: string) => {
    const service = SERVICES.find(s => s.id === id);
    return service?.name || '알 수 없음';
  };
  
  // 스타일리스트 이름 조회
  const getStylistName = (id: string) => {
    const stylist = STYLISTS.find(s => s.id === id);
    return stylist?.name || '알 수 없음';
  };
  
  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: ko
      });
    } catch (error) {
      return '날짜 정보 없음';
    }
  };
  
  // 이미지 모달
  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };
  
  // 이미지 모달 닫기
  const closeImageModal = () => {
    setSelectedImage(null);
  };
  
  if (reviews.length === 0) {
    return (
      <div className="text-center py-10">
        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
        <p className="mt-4 text-muted-foreground">아직 리뷰가 없습니다.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <Card key={review.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">{review.customerName}</CardTitle>
                <CardDescription>
                  {!stylistId && getStylistName(review.stylistId)} |&nbsp; 
                  {!serviceId && getServiceName(review.serviceId)}
                </CardDescription>
              </div>
              <Rating value={review.rating} readonly />
            </div>
          </CardHeader>
          
          <CardContent className="pb-2">
            <p className="text-sm mb-4">{review.content}</p>
            
            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 my-2">
                {review.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`리뷰 이미지 ${index + 1}`}
                    className="w-16 h-16 object-cover rounded cursor-pointer"
                    onClick={() => handleImageClick(image)}
                  />
                ))}
              </div>
            )}
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-xs text-muted-foreground">
                {formatDate(review.createdAt)}
              </div>
              <Badge variant="outline" className="text-xs">
                {reviews.indexOf(review) === 0 ? '최신 리뷰' : ''}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* 이미지 모달 */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={closeImageModal}
        >
          <div className="relative max-w-3xl max-h-[80vh] p-2">
            <img 
              src={selectedImage} 
              alt="확대된 이미지" 
              className="max-w-full max-h-full object-contain"
            />
            <button 
              className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-1"
              onClick={closeImageModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 