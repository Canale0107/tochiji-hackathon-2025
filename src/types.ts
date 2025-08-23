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
