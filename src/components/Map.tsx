import React, { useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { Post, Event } from "../types";
import "./Map.css";

interface MapProps {
  posts: Post[];
  events: Event[];
  activeTab: "posts" | "events" | "add";
}

const Map: React.FC<MapProps> = ({ posts, events, activeTab }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // アクセストークンを設定
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || "";

    // 地図を作成
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [139.7017, 35.6581],
      zoom: 15,
    });

    mapRef.current = map;

    // 地図が読み込まれた後に日本語ラベルを設定
    map.on("style.load", () => {
      try {
        // 日本語ラベルの設定（エラーハンドリング付き）
        const layers = [
          "country-label",
          "state-label",
          "settlement-label",
          "poi-label",
          "road-label",
          "water-label",
          "natural-label",
        ];

        layers.forEach((layerId) => {
          if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, "text-field", [
              "coalesce",
              ["get", "name_ja"],
              ["get", "name_en"],
              ["get", "name"],
            ]);
          }
        });

        console.log("✅ 日本語ラベルの設定が完了しました");
      } catch (error) {
        console.warn("⚠️ 日本語ラベル設定でエラー:", error);
      }
    });

    // 地図読み込み完了後にリサイズ
    map.on("load", () => {
      map.resize();
    });

    // クリーンアップ
    return () => {
      map.remove();
    };
  }, []);

  // マーカーをクリアする関数
  const clearMarkers = () => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
  };

  // 投稿のマーカーを作成する関数
  const createPostMarkers = useCallback(
    (map: mapboxgl.Map) => {
      posts.forEach((post) => {
        // 投稿用のシンプルなマーカー（青色）
        const marker = new mapboxgl.Marker({ color: "#3b82f6" });

        // ポップアップの内容を作成
        const popupContent = `
        <div style="
          padding: 12px; 
          width: 240px; 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: white;
        ">
          <div style="
            font-weight: 600; 
            font-size: 14px;
            color: #2c3e50; 
            margin-bottom: 8px;
            padding-bottom: 6px;
            border-bottom: 1px solid #ecf0f1;
          ">${post.author}</div>
          
          <div style="
            margin-bottom: 12px; 
            color: #34495e; 
            line-height: 1.5;
            font-size: 13px;
            word-wrap: break-word;
          ">${post.content}</div>
          
          <div style="
            display: flex; 
            justify-content: space-between; 
            align-items: center;
            padding-top: 8px;
            border-top: 1px solid #ecf0f1;
            font-size: 11px;
          ">
            <div style="
              color: #7f8c8d;
              font-weight: 500;
            ">
              ${new Date(post.timestamp).toLocaleString("ja-JP", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div style="
              color: #e74c3c; 
              font-weight: 600; 
              display: flex;
              align-items: center;
              gap: 2px;
            ">
              <span>❤️</span>
              <span>${post.likes}</span>
            </div>
          </div>
        </div>
      `;

        // ポップアップを作成
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: false,
        }).setHTML(popupContent);

        // マーカーを地図に追加
        marker
          .setLngLat([post.location.lng, post.location.lat])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.push(marker);
      });
    },
    [posts]
  );

  // イベントのマーカーを作成する関数
  const createEventMarkers = useCallback(
    (map: mapboxgl.Map) => {
      events.forEach((event) => {
        // イベント用のシンプルなマーカー（赤色）
        const marker = new mapboxgl.Marker({ color: "#ef4444" });

        // イベントのポップアップ内容を作成
        const popupContent = `
        <div style="
          padding: 12px; 
          width: 260px; 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: white;
        ">
          <div style="
            font-weight: 600; 
            font-size: 15px;
            color: #2c3e50; 
            margin-bottom: 8px;
            padding-bottom: 6px;
            border-bottom: 1px solid #ecf0f1;
          ">${event.title}</div>
          
          <div style="
            margin-bottom: 12px; 
            color: #34495e; 
            line-height: 1.5;
            font-size: 13px;
            word-wrap: break-word;
          ">${event.description}</div>
          
          <div style="
            display: flex; 
            justify-content: space-between; 
            align-items: center;
            margin-bottom: 8px;
            font-size: 12px;
          ">
            <div style="
              color: #7f8c8d;
              font-weight: 500;
            ">
              主催: ${event.organizer}
            </div>
            <div style="
              color: white; 
              background-color: #ef4444;
              padding: 2px 8px;
              border-radius: 12px;
              font-weight: 600; 
              font-size: 10px;
            ">
              ${event.category}
            </div>
          </div>
          
          <div style="
            padding-top: 8px;
            border-top: 1px solid #ecf0f1;
            font-size: 11px;
            color: #7f8c8d;
          ">
            ${new Date(event.startTime).toLocaleString("ja-JP", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })} - ${new Date(event.endTime).toLocaleString("ja-JP", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
          </div>
        </div>
      `;

        // ポップアップを作成
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: false,
        }).setHTML(popupContent);

        // マーカーを地図に追加
        marker
          .setLngLat([event.location.lng, event.location.lat])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.push(marker);
      });
    },
    [events]
  );

  // アクティブタブとデータが更新されたときにマーカーを更新
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // 既存のマーカーをクリア
    clearMarkers();

    // アクティブタブに応じてマーカーを作成
    if (activeTab === "posts" && posts.length > 0) {
      createPostMarkers(map);
    } else if (activeTab === "events" && events.length > 0) {
      createEventMarkers(map);
    }

    // クリーンアップ関数
    return () => {
      clearMarkers();
    };
  }, [posts, events, activeTab]);

  return (
    <div className="map-container">
      <div ref={mapContainer} className="map" />
    </div>
  );
};

export default Map;
