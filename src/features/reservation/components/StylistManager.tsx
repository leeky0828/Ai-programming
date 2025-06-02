'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Stylist } from '../constants/stylists';
import { getStylists, saveStylist, deleteStylist } from '../lib/storage';
import { v4 as uuidv4 } from 'uuid';
import { AlertCircle, Edit, Plus, Trash2, User } from 'lucide-react';

interface StylistForm {
  id: string;
  name: string;
  position: string;
  profileImage: string;
  specialties: string[];
  experience: number;
  availability: {
    start: string;
    end: string;
    daysOff: number[];
  };
}

export default function StylistManager() {
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null);
  const [formData, setFormData] = useState<StylistForm>({
    id: '',
    name: '',
    position: '',
    profileImage: 'https://picsum.photos/id/64/300/300',
    specialties: [],
    experience: 0,
    availability: {
      start: '10:00',
      end: '19:00',
      daysOff: [0], // 일요일
    },
  });
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // 스타일리스트 데이터 로드
  useEffect(() => {
    loadStylists();
  }, []);
  
  const loadStylists = () => {
    const data = getStylists();
    setStylists(data);
  };
  
  // 다이얼로그 열기 (추가 모드)
  const openAddDialog = () => {
    setFormData({
      id: uuidv4(),
      name: '',
      position: '',
      profileImage: 'https://picsum.photos/id/64/300/300',
      specialties: [],
      experience: 0,
      availability: {
        start: '10:00',
        end: '19:00',
        daysOff: [0], // 일요일
      },
    });
    setSelectedStylist(null);
    setError(null);
    setSuccess(null);
    setSpecialtyInput('');
    setDialogOpen(true);
  };
  
  // 다이얼로그 열기 (수정 모드)
  const openEditDialog = (stylist: Stylist) => {
    setFormData({
      ...stylist,
    });
    setSelectedStylist(stylist);
    setError(null);
    setSuccess(null);
    setSpecialtyInput('');
    setDialogOpen(true);
  };
  
  // 삭제 확인 다이얼로그 열기
  const openDeleteDialog = (stylist: Stylist) => {
    setSelectedStylist(stylist);
    setDeleteDialogOpen(true);
  };
  
  // 입력 필드 변경 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'experience') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0,
      });
    } else if (name.startsWith('availability.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        availability: {
          ...formData.availability,
          [field]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  // 요일 선택 처리
  const handleDayOffChange = (day: number) => {
    const currentDaysOff = [...formData.availability.daysOff];
    const index = currentDaysOff.indexOf(day);
    
    if (index >= 0) {
      // 이미 선택된 경우 제거
      currentDaysOff.splice(index, 1);
    } else {
      // 선택되지 않은 경우 추가
      currentDaysOff.push(day);
    }
    
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        daysOff: currentDaysOff,
      },
    });
  };
  
  // 전문 분야 추가
  const addSpecialty = () => {
    if (!specialtyInput.trim()) return;
    
    if (!formData.specialties.includes(specialtyInput.trim())) {
      setFormData({
        ...formData,
        specialties: [...formData.specialties, specialtyInput.trim()],
      });
    }
    
    setSpecialtyInput('');
  };
  
  // 전문 분야 제거
  const removeSpecialty = (specialty: string) => {
    setFormData({
      ...formData,
      specialties: formData.specialties.filter(s => s !== specialty),
    });
  };
  
  // 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // 입력 검증
    if (!formData.name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }
    
    if (!formData.position.trim()) {
      setError('직급을 입력해주세요.');
      return;
    }
    
    if (formData.specialties.length === 0) {
      setError('최소 하나 이상의 전문 분야를 입력해주세요.');
      return;
    }
    
    try {
      // 스타일리스트 저장
      saveStylist(formData as Stylist);
      
      // 목록 다시 로드
      loadStylists();
      
      setSuccess(selectedStylist ? '스타일리스트 정보가 수정되었습니다.' : '새 스타일리스트가 추가되었습니다.');
      
      // 3초 후 다이얼로그 닫기
      setTimeout(() => {
        setDialogOpen(false);
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('저장 중 오류가 발생했습니다.');
      }
    }
  };
  
  // 스타일리스트 삭제
  const handleDelete = () => {
    if (!selectedStylist) return;
    
    try {
      deleteStylist(selectedStylist.id);
      
      // 목록 다시 로드
      loadStylists();
      
      setDeleteDialogOpen(false);
      setSelectedStylist(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('삭제 중 오류가 발생했습니다.');
      }
    }
  };
  
  // 요일 이름 가져오기
  const getDayName = (day: number) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[day];
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>스타일리스트 관리</CardTitle>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          스타일리스트 추가
        </Button>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>오류</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {stylists.length === 0 ? (
          <div className="text-center py-10">
            <User className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
            <p className="mt-4 text-muted-foreground">등록된 스타일리스트가 없습니다.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>직급</TableHead>
                <TableHead>전문 분야</TableHead>
                <TableHead>경력</TableHead>
                <TableHead>근무 시간</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stylists.map((stylist) => (
                <TableRow key={stylist.id}>
                  <TableCell className="font-medium">{stylist.name}</TableCell>
                  <TableCell>{stylist.position}</TableCell>
                  <TableCell>{stylist.specialties.join(', ')}</TableCell>
                  <TableCell>{stylist.experience}년</TableCell>
                  <TableCell>
                    {stylist.availability.start} ~ {stylist.availability.end}
                    <div className="text-xs text-muted-foreground">
                      휴무일: {stylist.availability.daysOff.map(day => getDayName(day)).join(', ')}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDialog(stylist)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openDeleteDialog(stylist)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      
      {/* 스타일리스트 추가/수정 다이얼로그 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedStylist ? '스타일리스트 수정' : '새 스타일리스트 추가'}
            </DialogTitle>
            <DialogDescription>
              스타일리스트 정보를 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {success && (
                <Alert className="border-green-500 bg-green-50">
                  <AlertCircle className="h-4 w-4 text-green-500" />
                  <AlertTitle>성공</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="김미용"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">직급</Label>
                  <Input
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="수석 디자이너"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="profileImage">프로필 이미지 URL</Label>
                <Input
                  id="profileImage"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">경력 (년)</Label>
                <Input
                  id="experience"
                  name="experience"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.experience}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>전문 분야</Label>
                <div className="flex gap-2">
                  <Input
                    value={specialtyInput}
                    onChange={(e) => setSpecialtyInput(e.target.value)}
                    placeholder="커트, 펌, 염색 등"
                  />
                  <Button type="button" onClick={addSpecialty}>
                    추가
                  </Button>
                </div>
                
                {formData.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.specialties.map((specialty) => (
                      <div
                        key={specialty}
                        className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {specialty}
                        <button
                          type="button"
                          className="ml-2 text-muted-foreground hover:text-foreground"
                          onClick={() => removeSpecialty(specialty)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="availability.start">근무 시작 시간</Label>
                  <Input
                    id="availability.start"
                    name="availability.start"
                    type="time"
                    value={formData.availability.start}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="availability.end">근무 종료 시간</Label>
                  <Input
                    id="availability.end"
                    name="availability.end"
                    type="time"
                    value={formData.availability.end}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>휴무일</Label>
                <div className="flex flex-wrap gap-2">
                  {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                    <button
                      key={day}
                      type="button"
                      className={`px-3 py-1 rounded-full text-sm ${
                        formData.availability.daysOff.includes(day)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                      onClick={() => handleDayOffChange(day)}
                    >
                      {getDayName(day)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                취소
              </Button>
              <Button type="submit">
                {selectedStylist ? '수정하기' : '추가하기'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>스타일리스트 삭제</DialogTitle>
            <DialogDescription>
              정말로 스타일리스트 '{selectedStylist?.name}'을(를) 삭제하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 