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
  weeklyUsage: {
    dayOfWeek: number; // 0=日曜日, 1=月曜日, ..., 6=土曜日
    averageUsers: number; // その曜日の平均使用者数
    peakHour: number; // その曜日の最も混雑する時間帯
    congestionLevel: "low" | "medium" | "high"; // その曜日の混雑レベル
  }[];
  isOpen: boolean; // 現在営業中かどうか
  congestionLevel: "low" | "medium" | "high"; // 混雑レベル
}

export interface CongestionReport {
  id: string;
  smokingAreaId: string;
  smokingAreaName: string;
  location: Location;
  congestionLevel: "low" | "medium" | "high";
  currentUsers: number;
  capacity: number;
  timestamp: Date;
  author: string;
  comment?: string;
  language: "ja" | "en" | "zh" | "ko";
}
