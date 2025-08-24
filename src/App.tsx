import React, { useState, useEffect } from "react";
import "./App.css";
import Map from "./components/Map";
import Sidebar from "./components/Sidebar";
import CleanShibuyaMap from "./components/CleanShibuyaMap";
import { Post, Event, SmokingArea, CongestionReport } from "./types";
import {
  loadPosts,
  loadEvents,
  loadSmokingAreas,
  loadCongestionReports,
} from "./utils/dataLoader";

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [smokingAreas, setSmokingAreas] = useState<SmokingArea[]>([]);
  const [congestionReports, setCongestionReports] = useState<
    CongestionReport[]
  >([]);
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

  const addCongestionReport = (report: CongestionReport) => {
    setCongestionReports((prev) => [report, ...prev]);
  };

  // コンポーネントのマウント時にJSONファイルからデータを読み込む
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [
          loadedPosts,
          loadedEvents,
          loadedSmokingAreas,
          loadedCongestionReports,
        ] = await Promise.all([
          loadPosts(),
          loadEvents(),
          loadSmokingAreas(),
          loadCongestionReports(),
        ]);
        setPosts(loadedPosts);
        setEvents(loadedEvents);
        setSmokingAreas(loadedSmokingAreas);
        setCongestionReports(loadedCongestionReports);
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
        <CleanShibuyaMap
          smokingAreas={smokingAreas}
          congestionReports={congestionReports}
          onAddCongestionReport={addCongestionReport}
          selectedLanguage={selectedLanguage}
        />
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
