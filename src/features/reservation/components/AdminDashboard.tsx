'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  getReservations, 
  updateReservation, 
  deleteReservation, 
  getCurrentAdmin,
  getReviews
} from '../lib/storage';
import { Reservation, Review } from '../lib/types';
import { SERVICES } from '../constants/services';
import { STYLISTS } from '../constants/stylists';
import { useAdminStore } from '../store/adminStore';
import { cn } from '@/lib/utils';
import { LogOut, Search, User, Calendar, Clock, Trash2, CheckCircle, XCircle, Settings, MessageSquare } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { formatReadableDate, formatTime } from '../lib/datetime';
import StylistManager from './StylistManager';
import ReviewList from './ReviewList';

export default function AdminDashboard() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmationNote, setConfirmationNote] = useState('');
  const { logout } = useAdminStore();
  const currentAdmin = getCurrentAdmin();
  const [activeView, setActiveView] = useState<'reservations' | 'stylists' | 'reviews'>('reservations');
  const [reviews, setReviews] = useState<Review[]>([]);
  
  // 예약 데이터 로드
  useEffect(() => {
    const loadReservations = () => {
      const data = getReservations();
      setReservations(data);
      setFilteredReservations(data);
    };
    
    loadReservations();
    
    // 1분마다 데이터 새로고침
    const interval = setInterval(loadReservations, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // 리뷰 데이터 로드
  useEffect(() => {
    const loadReviews = () => {
      const data = getReviews();
      setReviews(data);
    };
    
    loadReviews();
  }, [activeView]);
  
  // 예약 상태별 필터링
  const filterByStatus = (status: 'all' | 'pending' | 'confirmed' | 'cancelled') => {
    setActiveTab(status);
    
    if (status === 'all') {
      setFilteredReservations(reservations);
    } else {
      setFilteredReservations(reservations.filter(r => r.status === status));
    }
  };
  
  // 검색어 기반 필터링
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query) {
      // 현재 활성 탭에 따라 필터링
      filterByStatus(activeTab);
      return;
    }
    
    // 현재 탭에 따라 우선 필터링 후 검색어로 다시 필터링
    const statusFiltered = 
      activeTab === 'all' 
        ? reservations 
        : reservations.filter(r => r.status === activeTab);
    
    setFilteredReservations(
      statusFiltered.filter(
        r =>
          r.customerName.toLowerCase().includes(query) ||
          r.customerPhone.includes(query) ||
          r.date.includes(query)
      )
    );
  };
  
  // 예약 확인 다이얼로그 열기
  const openConfirmDialog = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setConfirmationNote('');
    setDialogOpen(true);
  };
  
  // 예약 승인
  const confirmReservation = () => {
    if (!selectedReservation) return;
    
    const updates: Partial<Reservation> = { 
      status: 'confirmed',
      confirmationNote: confirmationNote,
      confirmedBy: currentAdmin?.name || '관리자',
      confirmedAt: new Date().toISOString()
    };
    
    updateReservation(selectedReservation.id, updates);
    
    // 상태 업데이트
    const updatedReservation = { ...selectedReservation, ...updates };
    
    setReservations(prev => 
      prev.map(r => 
        r.id === selectedReservation.id ? updatedReservation : r
      )
    );
    
    setFilteredReservations(prev => 
      prev.map(r => 
        r.id === selectedReservation.id ? updatedReservation : r
      )
    );
    
    setDialogOpen(false);
    setSelectedReservation(null);
  };
  
  // 예약 취소
  const cancelReservation = (id: string) => {
    if (window.confirm('정말로 이 예약을 취소하시겠습니까?')) {
      updateReservation(id, { 
        status: 'cancelled',
        cancelledBy: currentAdmin?.name || '관리자',
        cancelledAt: new Date().toISOString()
      });
      
      // 상태 업데이트
      setReservations(prev => 
        prev.map(r => 
          r.id === id ? { 
            ...r, 
            status: 'cancelled',
            cancelledBy: currentAdmin?.name || '관리자',
            cancelledAt: new Date().toISOString()
          } : r
        )
      );
      
      setFilteredReservations(prev => 
        prev.map(r => 
          r.id === id ? { 
            ...r, 
            status: 'cancelled',
            cancelledBy: currentAdmin?.name || '관리자',
            cancelledAt: new Date().toISOString()
          } : r
        )
      );
    }
  };
  
  // 예약 삭제
  const removeReservation = (id: string) => {
    if (window.confirm('정말로 이 예약을 삭제하시겠습니까?')) {
      deleteReservation(id);
      
      // 상태 업데이트
      setReservations(prev => prev.filter(r => r.id !== id));
      setFilteredReservations(prev => prev.filter(r => r.id !== id));
    }
  };
  
  // 상태 배지 렌더링
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">승인 대기중</Badge>;
      case 'confirmed':
        return <Badge variant="default">예약 확정</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">예약 취소</Badge>;
      default:
        return null;
    }
  };
  
  // 서비스와 스타일리스트 정보 조회
  const getServiceName = (serviceId: string) => {
    const service = SERVICES.find(s => s.id === serviceId);
    return service?.name || '알 수 없음';
  };
  
  const getStylistName = (stylistId: string) => {
    const stylist = STYLISTS.find(s => s.id === stylistId);
    return stylist?.name || '알 수 없음';
  };
  
  // 로그아웃 핸들러
  const handleLogout = () => {
    logout();
    window.location.reload();
  };
  
  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">관리자 대시보드</h1>
        
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground mr-2">
            <span className="font-medium text-foreground">{currentAdmin?.name || '관리자'}</span>님 환영합니다
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>관리자 계정</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>전체 예약</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-3xl font-bold">{reservations.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>대기 중</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-3xl font-bold">
              {reservations.filter(r => r.status === 'pending').length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>확정 예약</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-3xl font-bold">
              {reservations.filter(r => r.status === 'confirmed').length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>리뷰 수</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-3xl font-bold">
              {reviews.length}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="reservations" className="w-full space-y-6">
        <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger 
            value="reservations" 
            onClick={() => setActiveView('reservations')}
          >
            예약 관리
          </TabsTrigger>
          <TabsTrigger 
            value="stylists" 
            onClick={() => setActiveView('stylists')}
          >
            스타일리스트 관리
          </TabsTrigger>
          <TabsTrigger 
            value="reviews" 
            onClick={() => setActiveView('reviews')}
          >
            리뷰 관리
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="reservations" className="space-y-4">
          <div className="bg-background border rounded-lg p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="고객 이름, 전화번호, 날짜로 검색..."
                  className="pl-8 w-full md:w-[300px]"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              
              <Tabs defaultValue="all" className="w-full md:w-auto">
                <TabsList className="grid grid-cols-4 w-full md:w-[400px]">
                  <TabsTrigger 
                    value="all" 
                    onClick={() => filterByStatus('all')}
                  >
                    전체
                  </TabsTrigger>
                  <TabsTrigger 
                    value="pending" 
                    onClick={() => filterByStatus('pending')}
                  >
                    대기
                  </TabsTrigger>
                  <TabsTrigger 
                    value="confirmed" 
                    onClick={() => filterByStatus('confirmed')}
                  >
                    확정
                  </TabsTrigger>
                  <TabsTrigger 
                    value="cancelled" 
                    onClick={() => filterByStatus('cancelled')}
                  >
                    취소
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="mt-6">
              <ReservationList
                reservations={filteredReservations}
                getServiceName={getServiceName}
                getStylistName={getStylistName}
                renderStatusBadge={renderStatusBadge}
                confirmReservation={openConfirmDialog}
                cancelReservation={cancelReservation}
                removeReservation={removeReservation}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="stylists">
          <StylistManager />
        </TabsContent>
        
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>고객 리뷰 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <ReviewList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* 예약 확인 다이얼로그 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>예약 확정</DialogTitle>
            <DialogDescription>
              아래 예약을 확정하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          
          {selectedReservation && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">고객명</p>
                  <p>{selectedReservation.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">연락처</p>
                  <p>{selectedReservation.customerPhone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">서비스</p>
                  <p>{getServiceName(selectedReservation.serviceId)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">스타일리스트</p>
                  <p>{getStylistName(selectedReservation.stylistId)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">날짜</p>
                  <p>{formatReadableDate(selectedReservation.date)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">시간</p>
                  <p>{formatTime(selectedReservation.time)}</p>
                </div>
              </div>
              
              <div>
                <label htmlFor="note" className="text-sm font-medium mb-1 block">
                  메모 (선택사항)
                </label>
                <Input
                  id="note"
                  value={confirmationNote}
                  onChange={(e) => setConfirmationNote(e.target.value)}
                  placeholder="예약 관련 메모 (고객에게 보이지 않음)"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={confirmReservation}>
              예약 확정
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// 예약 목록 컴포넌트
interface ReservationListProps {
  reservations: Reservation[];
  getServiceName: (id: string) => string;
  getStylistName: (id: string) => string;
  renderStatusBadge: (status: string) => React.ReactNode;
  confirmReservation: (reservation: Reservation) => void;
  cancelReservation: (id: string) => void;
  removeReservation: (id: string) => void;
}

function ReservationList({
  reservations,
  getServiceName,
  getStylistName,
  renderStatusBadge,
  confirmReservation,
  cancelReservation,
  removeReservation
}: ReservationListProps) {
  if (reservations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">예약 정보가 없습니다.</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2 font-medium">고객명</th>
            <th className="text-left p-2 font-medium">연락처</th>
            <th className="text-left p-2 font-medium">서비스</th>
            <th className="text-left p-2 font-medium">스타일리스트</th>
            <th className="text-left p-2 font-medium">날짜/시간</th>
            <th className="text-left p-2 font-medium">상태</th>
            <th className="text-right p-2 font-medium">관리</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id} className="border-b hover:bg-muted/50">
              <td className="p-2">{reservation.customerName}</td>
              <td className="p-2">{reservation.customerPhone}</td>
              <td className="p-2">{getServiceName(reservation.serviceId)}</td>
              <td className="p-2">{getStylistName(reservation.stylistId)}</td>
              <td className="p-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    {formatReadableDate(reservation.date)}
                  </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>
                    {formatTime(reservation.time)}
                  </span>
                </div>
              </td>
              <td className="p-2">{renderStatusBadge(reservation.status)}</td>
              <td className="p-2 text-right">
                <div className="flex justify-end gap-1">
                  {reservation.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => confirmReservation(reservation)}
                      title="예약 확정"
                    >
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </Button>
                  )}
                  {reservation.status !== 'cancelled' && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => cancelReservation(reservation.id)}
                      title="예약 취소"
                    >
                      <XCircle className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeReservation(reservation.id)}
                    title="예약 삭제"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 