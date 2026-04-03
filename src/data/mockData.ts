import type { Worker, Review, JobCategory, User } from '../types';

export const mockUser: User = {
  id: 'u1',
  name: 'Alex Johnson',
  walletBalance: 1250,
  language: 'English',
};

export const categories: JobCategory[] = [
  { id: 'c1', name: 'Plumber', iconName: 'Wrench' },
  { id: 'c2', name: 'Electrician', iconName: 'Zap' },
  { id: 'c3', name: 'Cleaner', iconName: 'Sparkles' },
  { id: 'c4', name: 'Carpenter', iconName: 'Hammer' },
  { id: 'c5', name: 'Tutor', iconName: 'BookOpen' },
  { id: 'c6', name: 'Painter', iconName: 'Paintbrush' },
  { id: 'c7', name: 'Driver', iconName: 'Car' },
  { id: 'c8', name: 'Cook', iconName: 'ChefHat' },
];

export const mockWorkers: Worker[] = [
  {
    id: 'w1',
    name: 'Rajinder Singh',
    category: 'Plumber',
    rating: 4.8,
    reviewsCount: 124,
    hourlyRate: 45,
    distance: 2.3,
    experienceLevel: 'Expert',
    availability: true,
    isVerified: true,
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    portfolioImages: [
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=200',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=200'
    ],
    videoDemoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    skills: ['Pipe Fitting', 'Leak Repair', 'Drain Cleaning'],
    bio: 'Professional plumber with over 15 years of experience fixing leaks and fitting pipes in the local area. Guaranteed satisfaction.',
  },
  {
    id: 'w2',
    name: 'Sarah Collins',
    category: 'Electrician',
    rating: 4.9,
    reviewsCount: 89,
    hourlyRate: 60,
    distance: 1.1,
    experienceLevel: 'Expert',
    availability: false,
    isVerified: true,
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704b',
    portfolioImages: [
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=200'
    ],
    skills: ['Wiring', 'Panel Upgrades', 'Lighting Installation'],
    bio: 'Licensed electrician handling both residential and commercial projects. Safety and quality are my top priorities.',
  },
  {
    id: 'w3',
    name: 'Rahul Sharma',
    category: 'Tutor',
    rating: 4.5,
    reviewsCount: 42,
    hourlyRate: 25,
    distance: 5.4,
    experienceLevel: 'Beginner',
    availability: true,
    isVerified: false,
    avatarUrl: 'https://i.pravatar.cc/150?u=a04258a2462d826712d',
    portfolioImages: [],
    skills: ['Math', 'Physics', 'Programming'],
    bio: 'Math enthusiast and college student ready to help high schoolers crack their exams.',
  },
  {
    id: 'w4',
    name: 'Anita Devi',
    category: 'Cleaner',
    rating: 4.7,
    reviewsCount: 205,
    hourlyRate: 20,
    distance: 0.8,
    experienceLevel: 'Intermediate',
    availability: true,
    isVerified: true,
    avatarUrl: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
    portfolioImages: [
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=200'
    ],
    skills: ['Deep Cleaning', 'Sanitization', 'Organization'],
    bio: 'Detailed oriented cleaner providing top-notch deep cleaning services for your home.',
  }
];

export const mockReviews: Review[] = [
  {
    id: 'r1',
    workerId: 'w1',
    userId: 'u2',
    userName: 'John Doe',
    rating: 5,
    skillRating: 5,
    behaviorRating: 5,
    comment: 'Amazing work! Fixed my sink in 10 minutes.',
    date: '10 mins ago'
  },
  {
    id: 'r2',
    workerId: 'w1',
    userId: 'u3',
    userName: 'Emma Watson',
    rating: 4,
    skillRating: 5,
    behaviorRating: 4,
    comment: 'Great job but arrived 15 mins late.',
    date: '2 days ago'
  }
];
