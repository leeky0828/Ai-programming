'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UserPlus, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// localStorage에 관리자 계정 정보를 저장하는 키
const ADMIN_ACCOUNTS_KEY = 'hairnow_admin_accounts';

interface AdminAccount {
  username: string;
  password: string;
  name: string;
  createdAt: string;
}

export default function AdminRegister() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 기존 관리자 계정 목록 조회
  const getAdminAccounts = (): AdminAccount[] => {
    if (typeof window === 'undefined') {
      return [];
    }
    
    const accountsJson = localStorage.getItem(ADMIN_ACCOUNTS_KEY);
    if (!accountsJson) {
      return [];
    }
    
    try {
      return JSON.parse(accountsJson);
    } catch (error) {
      console.error('관리자 계정 파싱 오류:', error);
      return [];
    }
  };

  // 관리자 계정 저장
  const saveAdminAccount = (account: AdminAccount): void => {
    const accounts = getAdminAccounts();
    
    // 중복 아이디 체크
    const existingAccount = accounts.find(acc => acc.username === account.username);
    if (existingAccount) {
      throw new Error('이미 사용 중인 아이디입니다.');
    }
    
    const updatedAccounts = [...accounts, account];
    localStorage.setItem(ADMIN_ACCOUNTS_KEY, JSON.stringify(updatedAccounts));
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // 입력값 검증
    if (!username || !password || !confirmPassword || !name) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }
    
    // 관리자 계정 생성
    try {
      const newAccount: AdminAccount = {
        username,
        password,
        name,
        createdAt: new Date().toISOString()
      };
      
      saveAdminAccount(newAccount);
      setSuccess(true);
      
      // 폼 초기화
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setName('');
      
      // 3초 후 관리자 로그인 페이지로 이동
      setTimeout(() => {
        router.push('/admin');
      }, 3000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('관리자 계정 생성 중 오류가 발생했습니다.');
      }
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-[70vh] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">관리자 계정 등록</CardTitle>
          <CardDescription className="text-center">
            HairNow 서비스의 관리자 계정을 생성합니다.
          </CardDescription>
        </CardHeader>
        
        {success ? (
          <CardContent className="space-y-4">
            <Alert className="border-green-500 bg-green-50">
              <AlertCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>계정 생성 성공</AlertTitle>
              <AlertDescription>
                관리자 계정이 성공적으로 생성되었습니다. 로그인 페이지로 이동합니다.
              </AlertDescription>
            </Alert>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">아이디</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="관리자 아이디"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="관리자 이름"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="6자 이상 입력"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="비밀번호 재입력"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>오류</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                type="submit" 
                className="w-full"
              >
                계정 생성
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                asChild
              >
                <Link href="/admin">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  로그인 페이지로 돌아가기
                </Link>
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
} 