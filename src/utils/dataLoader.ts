import { Post, Event, SmokingArea } from "../types";

// JSONファイルからデータを読み込む関数
export const loadPosts = async (): Promise<Post[]> => {
  try {
    const response = await fetch("/data/posts.json");
    if (!response.ok) {
      throw new Error("Failed to load posts");
    }
    const posts = await response.json();

    // JSONの日付文字列をDateオブジェクトに変換
    return posts.map((post: any) => ({
      ...post,
      timestamp: new Date(post.timestamp),
    }));
  } catch (error) {
    console.error("Error loading posts:", error);
    return [];
  }
};

export const loadEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch("/data/events.json");
    if (!response.ok) {
      throw new Error("Failed to load events");
    }
    const events = await response.json();

    // JSONの日付文字列をDateオブジェクトに変換
    return events.map((event: any) => ({
      ...event,
      startTime: new Date(event.startTime),
      endTime: new Date(event.endTime),
    }));
  } catch (error) {
    console.error("Error loading events:", error);
    return [];
  }
};

// データをJSONファイルに保存する関数（将来的な拡張用）
export const savePosts = async (posts: Post[]): Promise<boolean> => {
  try {
    // 実際の実装では、サーバーサイドのAPIに送信する
    console.log("Saving posts:", posts);
    return true;
  } catch (error) {
    console.error("Error saving posts:", error);
    return false;
  }
};

export const saveEvents = async (events: Event[]): Promise<boolean> => {
  try {
    // 実際の実装では、サーバーサイドのAPIに送信する
    console.log("Saving events:", events);
    return true;
  } catch (error) {
    console.error("Error saving events:", error);
    return false;
  }
};

export const loadSmokingAreas = async (): Promise<SmokingArea[]> => {
  try {
    const response = await fetch("/data/smoking-areas.json");
    if (!response.ok) {
      throw new Error("Failed to load smoking areas");
    }
    const smokingAreas = await response.json();

    // JSONの日付文字列をDateオブジェクトに変換
    return smokingAreas.map((area: any) => ({
      ...area,
      lastUpdated: new Date(area.lastUpdated),
    }));
  } catch (error) {
    console.error("Error loading smoking areas:", error);
    return [];
  }
};
