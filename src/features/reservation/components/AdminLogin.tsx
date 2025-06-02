'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminStore } from '../store/adminStore';
import { Lock, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading, isAuthenticated } = useAdminStore();
  
  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      return;
    }
    
    await login({ username, password });
  };
  
  // 로그인 후 페이지 리로드
  useEffect(() => {
    if (isAuthenticated) {
      window.location.reload();
    }
  }, [isAuthenticated]);
  
  return (
    <div className="flex justify-center items-center min-h-[50vh] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">관리자 로그인</CardTitle>
          <CardDescription className="text-center">
            미용실 예약 관리를 위한 관리자 로그인
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">아이디</Label>
              <Input
                id="username"
                type="text"
                placeholder="아이디를 입력하세요"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {error && (
              <p className="text-sm text-destructive text-center">
                {error}
              </p>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !username || !password}
            >
              {loading ? '로그인 중...' : '로그인'}
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              asChild
            >
              <Link href="/admin/register">
                <UserPlus className="mr-2 h-4 w-4" />
                새 관리자 계정 등록
              </Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 