export interface Worker {
  user_id: number;
  category: string;
  rating: number;
  reviewsCount: number;
  hourly_rate: number;
  distance: number; // in km (calculated later)
  experience_level: "Beginner" | "Intermediate" | "Expert";
  availability: boolean;
  is_verified: boolean;
  avatar_url: string;
  video_url?: string;
  skills: string[];
  bio: string;
  latitude: number;
  longitude: number;
}

export interface WorkerProfile extends Worker {
  id: number;
  name: string;
}

export interface Review {
  id: number;
  worker_id: number;
  client_id: number;
  rating: number; // Overall
  comment: string;
  timestamp: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'client' | 'worker';
  wallet_balance: number;
  language: string;
}

export interface Booking {
  id: number;
  client_id: number;
  worker_id: number;
  worker_name: string;
  category: string;
  job_date: string;
  status: 'pending' | 'completed' | 'cancelled';
  total_price: number;
}

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  type: 'text' | 'video';
  timestamp: string;
}

export interface JobCategory {
  id: string;
  name: string;
  iconName: string;
}
