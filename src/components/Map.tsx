import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Post } from "../types";
import { loadPosts } from "../utils/dataLoader";
import "./Map.css";

const Map: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  // 投稿データを読み込み
  useEffect(() => {
    const fetchPosts = async () => {
      const postsData = await loadPosts();
      setPosts(postsData);
    };
    fetchPosts();
  }, []);

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

  // 投稿データが更新されたときにマーカーを追加
  useEffect(() => {
    if (!mapRef.current || posts.length === 0) return;

    const map = mapRef.current;

    // 既存のマーカーをクリア（マーカーを管理するための配列を作成）
    const markers: mapboxgl.Marker[] = [];

    // 各投稿に対してマーカーを作成
    posts.forEach((post) => {
      // シンプルなマーカーを作成
      const marker = new mapboxgl.Marker();

      // ポップアップの内容を作成（サイズ調整）
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

      markers.push(marker);
    });

    // クリーンアップ関数でマーカーを削除
    return () => {
      markers.forEach((marker) => marker.remove());
    };
  }, [posts]);

  return (
    <div className="map-container">
      <div ref={mapContainer} className="map" />
    </div>
  );
};

export default Map;
