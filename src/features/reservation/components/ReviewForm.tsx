'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Rating } from '@/components/ui/rating';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Image as ImageIcon, Star, Trash } from 'lucide-react';
import { Reservation, Review } from '../lib/types';
import { saveReview, getReviewByReservationId } from '../lib/storage';
import { SERVICES } from '../constants/services';
import { STYLISTS } from '../constants/stylists';
import { v4 as uuidv4 } from 'uuid';

interface ReviewFormProps {
  reservation: Reservation;
  onSuccess?: () => void;
}

export default function ReviewForm({ reservation, onSuccess }: ReviewFormProps) {
  const existingReview = getReviewByReservationId(reservation.id);
  
  const [rating, setRating] = useState<number>(existingReview?.rating || 5);
  const [content, setContent] = useState<string>(existingReview?.content || '');
  const [images, setImages] = useState<string[]>(existingReview?.images || []);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  
  const service = SERVICES.find(s => s.id === reservation.serviceId);
  const stylist = STYLISTS.find(s => s.id === reservation.stylistId);
  
  // 이미지 업로드 처리 (로컬 스토리지에 저장)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImages([...images, event.target.result.toString()]);
      }
    };
    reader.readAsDataURL(file);
    
    // 입력 필드 초기화 (같은 파일 다시 선택할 수 있도록)
    e.target.value = '';
  };
  
  // 이미지 삭제
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };
  
  // 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // 입력 검증
    if (rating < 1) {
      setError('별점을 선택해주세요.');
      return;
    }
    
    if (!content.trim()) {
      setError('리뷰 내용을 입력해주세요.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // 리뷰 데이터 생성
      const reviewData: Review = {
        id: existingReview?.id || uuidv4(),
        reservationId: reservation.id,
        customerName: reservation.customerName,
        stylistId: reservation.stylistId,
        serviceId: reservation.serviceId,
        rating,
        content,
        images: images.length > 0 ? images : undefined,
        createdAt: existingReview?.createdAt || new Date().toISOString()
      };
      
      // 리뷰 저장
      saveReview(reviewData);
      
      setSuccess(true);
      
      // 성공 콜백 호출
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('리뷰 저장 중 오류가 발생했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{existingReview ? '리뷰 수정' : '리뷰 작성'}</CardTitle>
        <CardDescription>
          {service?.name || '시술'} - {stylist?.name || '스타일리스트'}에 대한 리뷰를 남겨주세요.
        </CardDescription>
      </CardHeader>
      
      {success ? (
        <CardContent>
          <Alert className="border-green-500 bg-green-50">
            <Star className="h-4 w-4 text-green-500" />
            <AlertTitle>리뷰가 등록되었습니다</AlertTitle>
            <AlertDescription>
              소중한 의견에 감사드립니다.
            </AlertDescription>
          </Alert>
        </CardContent>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>별점</Label>
              <div className="flex items-center">
                <Rating value={rating} onChange={setRating} />
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating.toFixed(1)}점
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">리뷰 내용</Label>
              <Textarea
                id="content"
                placeholder="시술 품질, 스타일리스트의 서비스 등에 대한 솔직한 리뷰를 남겨주세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>사진 첨부 (선택)</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {images.map((image, index) => (
                  <div 
                    key={index} 
                    className="relative group w-24 h-24 rounded overflow-hidden border"
                  >
                    <img
                      src={image}
                      alt={`리뷰 이미지 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                
                {images.length < 3 && (
                  <label className="w-24 h-24 flex flex-col items-center justify-center border border-dashed rounded cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                    <ImageIcon className="w-6 h-6 mb-1" />
                    <span className="text-xs">사진 추가</span>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-muted-foreground">최대 3장까지 업로드 가능</p>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>오류</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? '처리 중...' : existingReview ? '리뷰 수정하기' : '리뷰 등록하기'}
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  );
} 