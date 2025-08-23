import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { Post, Event } from "../types";
import "./Map.css";

// Mapboxのアクセストークン（実際の使用時は環境変数から取得）
mapboxgl.accessToken = "pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example";

interface MapProps {
  posts: Post[];
  events: Event[];
  selectedLanguage: "ja" | "en" | "zh" | "ko";
}

const Map: React.FC<MapProps> = ({ posts, events, selectedLanguage }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current) return; // 既にマップが初期化されている場合は何もしない

    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [139.7016, 35.658], // 渋谷駅の座標
        zoom: 15,
        pitch: 45,
        bearing: 0,
      });

      // マップの読み込み完了後にコントロールを追加
      map.current.on("load", () => {
        if (map.current) {
          // ナビゲーションコントロールを追加
          map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

          // フルスクリーンコントロールを追加
          map.current.addControl(new mapboxgl.FullscreenControl(), "top-right");
        }
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // 投稿とイベントのマーカーを更新
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    // 既存のマーカーを削除
    const existingMarkers = document.querySelectorAll(".mapboxgl-marker");
    existingMarkers.forEach((marker) => marker.remove());

    // 投稿のマーカーを追加
    posts.forEach((post) => {
      const markerEl = document.createElement("div");
      markerEl.className = "post-marker";
      markerEl.innerHTML = "💬";
      markerEl.style.fontSize = "24px";
      markerEl.style.cursor = "pointer";

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="popup-content">
            <div class="popup-header">
              <strong>${post.author}</strong>
              <span class="timestamp">${new Date(
                post.timestamp
              ).toLocaleString()}</span>
            </div>
            <div class="popup-body">
              <p>${post.content}</p>
              ${
                post.translatedContent?.[selectedLanguage]
                  ? `<p class="translation">${post.translatedContent[selectedLanguage]}</p>`
                  : ""
              }
            </div>
            <div class="popup-footer">
              <span class="likes">❤️ ${post.likes}</span>
            </div>
          </div>
        `);

      new mapboxgl.Marker(markerEl)
        .setLngLat([post.location.lng, post.location.lat])
        .setPopup(popup)
        .addTo(map.current!);
    });

    // イベントのマーカーを追加
    events.forEach((event) => {
      const markerEl = document.createElement("div");
      markerEl.className = "event-marker";
      markerEl.innerHTML = "🎉";
      markerEl.style.fontSize = "24px";
      markerEl.style.cursor = "pointer";

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="popup-content">
            <div class="popup-header">
              <strong>${event.title}</strong>
              <span class="category">${event.category}</span>
            </div>
            <div class="popup-body">
              <p>${event.description}</p>
              <p><strong>主催者:</strong> ${event.organizer}</p>
              <p><strong>期間:</strong> ${new Date(
                event.startTime
              ).toLocaleDateString()} - ${new Date(
        event.endTime
      ).toLocaleDateString()}</p>
              ${
                event.translatedTitle?.[selectedLanguage]
                  ? `<p class="translation"><strong>${event.translatedTitle[selectedLanguage]}</strong></p>`
                  : ""
              }
            </div>
          </div>
        `);

      new mapboxgl.Marker(markerEl)
        .setLngLat([event.location.lng, event.location.lat])
        .setPopup(popup)
        .addTo(map.current!);
    });
  }, [posts, events, selectedLanguage]);

  return (
    <div className="map-container">
      <div ref={mapContainer} className="map" />
    </div>
  );
};

export default Map;
