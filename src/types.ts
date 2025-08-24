export interface Location {
  lat: number;
  lng: number;
}

export interface Post {
  id: string;
  content: string;
  location: Location;
  timestamp: Date;
  author: string;
  language: "ja" | "en" | "zh" | "ko";
  imageUrl?: string;
  likes: number;
  translatedContent?: {
    ja?: string;
    en?: string;
    zh?: string;
    ko?: string;
  };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: Location;
  startTime: Date;
  endTime: Date;
  organizer: string;
  category: "popup" | "exhibition" | "sale" | "festival" | "other";
  imageUrl?: string;
  language: "ja" | "en" | "zh" | "ko";
  translatedTitle?: {
    ja?: string;
    en?: string;
    zh?: string;
    ko?: string;
  };
  translatedDescription?: {
    ja?: string;
    en?: string;
    zh?: string;
    ko?: string;
  };
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  location: Location;
  startDate: Date;
  endDate: Date;
  reward?: string;
  participants: number;
  maxParticipants?: number;
}

export interface SmokingArea {
  id: string;
  name: string;
  location: Location;
  address: string;
  capacity: number; // 最大収容人数
  currentOccupancy: number; // 現在の使用者数
  operatingHours: {
    start: string; // "06:00"
    end: string; // "23:00"
  };
  amenities: string[]; // 設備（例: "灰皿", "屋根", "椅子"）
  type: "outdoor" | "indoor" | "semi-outdoor"; // 喫煙所のタイプ
  lastUpdated: Date; // 混雑度の最終更新時刻
  hourlyUsage: {
    hour: number; // 0-23
    averageUsers: number; // その時間帯の平均使用者数
  }[];
  isOpen: boolean; // 現在営業中かどうか
  congestionLevel: "low" | "medium" | "high"; // 混雑レベル
}
