export interface Stylist {
  id: string;
  name: string;
  position: string;
  profileImage: string;
  specialties: string[];
  experience: number;
  availability: {
    start: string; // 'HH:MM' 형식의 시작 시간
    end: string; // 'HH:MM' 형식의 종료 시간
    daysOff: number[]; // 0(일요일)~6(토요일) 중 쉬는 날
  };
}

export const STYLISTS: Stylist[] = [
  {
    id: 'stylist1',
    name: '김미용',
    position: '수석 디자이너',
    profileImage: 'https://picsum.photos/id/64/300/300',
    specialties: ['커트', '염색'],
    experience: 8,
    availability: {
      start: '10:00',
      end: '19:00',
      daysOff: [0, 1], // 일, 월 휴무
    },
  },
  {
    id: 'stylist2',
    name: '이스타일',
    position: '디자이너',
    profileImage: 'https://picsum.photos/id/65/300/300',
    specialties: ['펌', '트리트먼트'],
    experience: 5,
    availability: {
      start: '11:00',
      end: '20:00',
      daysOff: [0, 3], // 일, 수 휴무
    },
  },
  {
    id: 'stylist3',
    name: '박헤어',
    position: '시니어 디자이너',
    profileImage: 'https://picsum.photos/id/91/300/300',
    specialties: ['스타일링', '커트'],
    experience: 7,
    availability: {
      start: '10:00',
      end: '19:00',
      daysOff: [0, 2], // 일, 화 휴무
    },
  },
]; 