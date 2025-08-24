import React, { useState, useEffect } from "react";
import "./App.css";
import Map from "./components/Map";
import Sidebar from "./components/Sidebar";
import { Post, Event } from "./types";
import { loadPosts, loadEvents } from "./utils/dataLoader";

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<
    "ja" | "en" | "zh" | "ko"
  >("ja");
  const [isLoading, setIsLoading] = useState(true);

  const addPost = (post: Post) => {
    setPosts((prev) => [post, ...prev]);
  };

  const addEvent = (event: Event) => {
    setEvents((prev) => [event, ...prev]);
  };

  // コンポーネントのマウント時にJSONファイルからデータを読み込む
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [loadedPosts, loadedEvents] = await Promise.all([
          loadPosts(),
          loadEvents(),
        ]);
        setPosts(loadedPosts);
        setEvents(loadedEvents);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>データを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Sidebar
        posts={posts}
        events={events}
        onAddPost={addPost}
        onAddEvent={addEvent}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />
      <Map />
    </div>
  );
}

export default App;
