import React, { useState, useEffect } from "react";
import "./App.css";
import Map from "./components/Map";
import Sidebar from "./components/Sidebar";
import CleanShibuyaMap from "./components/CleanShibuyaMap";
import { Post, Event, SmokingArea } from "./types";
import { loadPosts, loadEvents, loadSmokingAreas } from "./utils/dataLoader";

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [smokingAreas, setSmokingAreas] = useState<SmokingArea[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<
    "ja" | "en" | "zh" | "ko"
  >("ja");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "events" | "add">(
    "posts"
  );
  const [currentPage, setCurrentPage] = useState<"main" | "clean-map">("main");

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
        const [loadedPosts, loadedEvents, loadedSmokingAreas] =
          await Promise.all([loadPosts(), loadEvents(), loadSmokingAreas()]);
        setPosts(loadedPosts);
        setEvents(loadedEvents);
        setSmokingAreas(loadedSmokingAreas);
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

  if (currentPage === "clean-map") {
    return (
      <div className="App clean-map-app">
        <div className="page-navigation">
          <button className="nav-button" onClick={() => setCurrentPage("main")}>
            ← メインページに戻る
          </button>
        </div>
        <CleanShibuyaMap smokingAreas={smokingAreas} />
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
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <Map posts={posts} events={events} activeTab={activeTab} />
      <div className="page-navigation">
        <button
          className="nav-button clean-map-button"
          onClick={() => setCurrentPage("clean-map")}
        >
          🚬 Clean Shibuya Map
        </button>
      </div>
    </div>
  );
}

export default App;
