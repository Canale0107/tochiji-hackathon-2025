import React, { useState } from "react";
import "./App.css";
import Map from "./components/Map";
import Sidebar from "./components/Sidebar";
import { Post, Event } from "./types";
import { samplePosts, sampleEvents } from "./sampleData";

function App() {
  const [posts, setPosts] = useState<Post[]>(samplePosts);
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [selectedLanguage, setSelectedLanguage] = useState<
    "ja" | "en" | "zh" | "ko"
  >("ja");

  const addPost = (post: Post) => {
    setPosts((prev) => [post, ...prev]);
  };

  const addEvent = (event: Event) => {
    setEvents((prev) => [event, ...prev]);
  };

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
      <Map posts={posts} events={events} selectedLanguage={selectedLanguage} />
    </div>
  );
}

export default App;
