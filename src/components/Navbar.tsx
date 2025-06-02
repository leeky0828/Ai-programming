'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { Home, Calendar, User, MessageSquare, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navigationItems = [
  { path: '/', label: '홈', icon: <Home className="h-5 w-5" /> },
  { path: '/reservation', label: '예약하기', icon: <Calendar className="h-5 w-5" /> },
  { path: '/my-reservations', label: '예약확인', icon: <User className="h-5 w-5" /> },
  { path: '/reviews', label: '리뷰', icon: <MessageSquare className="h-5 w-5" /> },
  { path: '/admin', label: '관리자', icon: <Settings className="h-5 w-5" /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold mr-8">HairNow</Link>
          
          {/* 데스크톱 메뉴 */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map(({ path, label, icon }) => (
              <Button
                key={path}
                variant={pathname === path ? 'default' : 'ghost'}
                asChild
                className={cn(
                  "flex items-center space-x-1",
                  pathname === path && "bg-muted"
                )}
              >
                <Link href={path} className="flex items-center">
                  {icon}
                  <span className="ml-1">{label}</span>
                </Link>
              </Button>
            ))}
          </nav>
        </div>
        
        {/* 모바일 메뉴 버튼 */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      
      {/* 모바일 메뉴 (토글) */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container flex flex-col py-2">
            {navigationItems.map(({ path, label, icon }) => (
              <Button
                key={path}
                variant="ghost"
                asChild
                className={cn(
                  "justify-start mb-1",
                  pathname === path && "bg-muted"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <Link href={path} className="flex items-center space-x-2">
                  {icon}
                  <span>{label}</span>
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
} 