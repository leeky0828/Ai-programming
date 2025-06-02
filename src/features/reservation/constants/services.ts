export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
}

export const SERVICES: Service[] = [
  {
    id: 'cut',
    name: '커트',
    description: '기본 헤어 커트 서비스',
    price: 25000,
    durationMinutes: 60,
  },
  {
    id: 'color',
    name: '염색',
    description: '트렌디한 헤어 컬러링',
    price: 80000,
    durationMinutes: 120,
  },
  {
    id: 'perm',
    name: '펌',
    description: '볼륨감 있는 웨이브 펌',
    price: 100000,
    durationMinutes: 150,
  },
  {
    id: 'treatment',
    name: '트리트먼트',
    description: '손상된 모발 집중 케어',
    price: 50000,
    durationMinutes: 60,
  },
  {
    id: 'styling',
    name: '스타일링',
    description: '특별한 날을 위한 스타일링',
    price: 40000,
    durationMinutes: 60,
  },
]; 