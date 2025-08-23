import React, { useState } from "react";
import { Post, Event } from "../types";
import { MapPin, MessageCircle, Calendar, Globe, Plus } from "lucide-react";
import "./Sidebar.css";

interface SidebarProps {
  posts: Post[];
  events: Event[];
  onAddPost: (post: Post) => void;
  onAddEvent: (event: Event) => void;
  selectedLanguage: "ja" | "en" | "zh" | "ko";
  onLanguageChange: (language: "ja" | "en" | "zh" | "ko") => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  posts,
  events,
  onAddPost,
  onAddEvent,
  selectedLanguage,
  onLanguageChange,
}) => {
  const [activeTab, setActiveTab] = useState<"posts" | "events" | "add">(
    "posts"
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [formType, setFormType] = useState<"post" | "event">("post");

  const languages = [
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ko", name: "한국어", flag: "🇰🇷" },
  ];

  const handleAddPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newPost: Post = {
      id: Date.now().toString(),
      content: formData.get("content") as string,
      location: {
        lat: parseFloat(formData.get("lat") as string),
        lng: parseFloat(formData.get("lng") as string),
      },
      timestamp: new Date(),
      author: formData.get("author") as string,
      language: selectedLanguage,
      likes: 0,
    };

    onAddPost(newPost);
    setShowAddForm(false);
    (e.target as HTMLFormElement).reset();
  };

  const handleAddEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newEvent: Event = {
      id: Date.now().toString(),
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      location: {
        lat: parseFloat(formData.get("lat") as string),
        lng: parseFloat(formData.get("lng") as string),
      },
      startTime: new Date(formData.get("startTime") as string),
      endTime: new Date(formData.get("endTime") as string),
      organizer: formData.get("organizer") as string,
      category: formData.get("category") as Event["category"],
      language: selectedLanguage,
    };

    onAddEvent(newEvent);
    setShowAddForm(false);
    (e.target as HTMLFormElement).reset();
  };

  const getLanguageName = (code: string) => {
    return languages.find((lang) => lang.code === code)?.name || code;
  };

  return (
    <div className="sidebar">
      {/* ヘッダー */}
      <div className="sidebar-header">
        <h1>🎨 Shibuya Live Canvas</h1>
        <p>渋谷の"いま"を共有しよう</p>
      </div>

      {/* 言語選択 */}
      <div className="language-selector">
        <Globe size={16} />
        <select
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value as any)}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* タブナビゲーション */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === "posts" ? "active" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          <MessageCircle size={16} />
          投稿
        </button>
        <button
          className={`tab-button ${activeTab === "events" ? "active" : ""}`}
          onClick={() => setActiveTab("events")}
        >
          <Calendar size={16} />
          イベント
        </button>
        <button
          className={`tab-button ${activeTab === "add" ? "active" : ""}`}
          onClick={() => setActiveTab("add")}
        >
          <Plus size={16} />
          追加
        </button>
      </div>

      {/* タブコンテンツ */}
      <div className="tab-content">
        {activeTab === "posts" && (
          <div className="posts-list">
            <h3>最新の投稿</h3>
            {posts.length === 0 ? (
              <p className="empty-state">まだ投稿がありません</p>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="post-item">
                  <div className="post-header">
                    <strong>{post.author}</strong>
                    <span className="post-language">
                      {getLanguageName(post.language)}
                    </span>
                  </div>
                  <p className="post-content">{post.content}</p>
                  <div className="post-footer">
                    <span className="post-location">
                      <MapPin size={12} />
                      {post.location.lat.toFixed(4)},{" "}
                      {post.location.lng.toFixed(4)}
                    </span>
                    <span className="post-likes">❤️ {post.likes}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "events" && (
          <div className="events-list">
            <h3>開催中のイベント</h3>
            {events.length === 0 ? (
              <p className="empty-state">まだイベントがありません</p>
            ) : (
              events.map((event) => (
                <div key={event.id} className="event-item">
                  <div className="event-header">
                    <strong>{event.title}</strong>
                    <span className={`event-category ${event.category}`}>
                      {event.category}
                    </span>
                  </div>
                  <p className="event-description">{event.description}</p>
                  <div className="event-footer">
                    <span className="event-organizer">
                      by {event.organizer}
                    </span>
                    <span className="event-dates">
                      {new Date(event.startTime).toLocaleDateString()} -{" "}
                      {new Date(event.endTime).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "add" && (
          <div className="add-content">
            <h3>新しいコンテンツを追加</h3>

            <div className="add-buttons">
              <button
                className={`add-type-button ${
                  formType === "post" ? "active" : ""
                }`}
                onClick={() => setFormType("post")}
              >
                <MessageCircle size={16} />
                投稿を追加
              </button>
              <button
                className={`add-type-button ${
                  formType === "event" ? "active" : ""
                }`}
                onClick={() => setFormType("event")}
              >
                <Calendar size={16} />
                イベントを追加
              </button>
            </div>

            {formType === "post" ? (
              <form onSubmit={handleAddPost} className="add-form">
                <div className="form-group">
                  <label>投稿者名</label>
                  <input name="author" required placeholder="あなたの名前" />
                </div>
                <div className="form-group">
                  <label>投稿内容</label>
                  <textarea
                    name="content"
                    required
                    placeholder="いま、ここで感じたことを共有しよう"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>緯度</label>
                    <input
                      name="lat"
                      type="number"
                      step="0.0001"
                      required
                      placeholder="35.6580"
                    />
                  </div>
                  <div className="form-group">
                    <label>経度</label>
                    <input
                      name="lng"
                      type="number"
                      step="0.0001"
                      required
                      placeholder="139.7016"
                    />
                  </div>
                </div>
                <button type="submit" className="submit-button">
                  投稿する
                </button>
              </form>
            ) : (
              <form onSubmit={handleAddEvent} className="add-form">
                <div className="form-group">
                  <label>イベントタイトル</label>
                  <input
                    name="title"
                    required
                    placeholder="イベントのタイトル"
                  />
                </div>
                <div className="form-group">
                  <label>説明</label>
                  <textarea
                    name="description"
                    required
                    placeholder="イベントの詳細説明"
                  />
                </div>
                <div className="form-group">
                  <label>主催者</label>
                  <input name="organizer" required placeholder="主催者名" />
                </div>
                <div className="form-group">
                  <label>カテゴリ</label>
                  <select name="category" required>
                    <option value="popup">ポップアップストア</option>
                    <option value="exhibition">展示会</option>
                    <option value="sale">セール</option>
                    <option value="festival">お祭り</option>
                    <option value="other">その他</option>
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>開始日時</label>
                    <input name="startTime" type="datetime-local" required />
                  </div>
                  <div className="form-group">
                    <label>終了日時</label>
                    <input name="endTime" type="datetime-local" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>緯度</label>
                    <input
                      name="lat"
                      type="number"
                      step="0.0001"
                      required
                      placeholder="35.6580"
                    />
                  </div>
                  <div className="form-group">
                    <label>経度</label>
                    <input
                      name="lng"
                      type="number"
                      step="0.0001"
                      required
                      placeholder="139.7016"
                    />
                  </div>
                </div>
                <button type="submit" className="submit-button">
                  イベントを追加
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
