import React, { useEffect, useRef, useCallback, useState } from "react";
import mapboxgl from "mapbox-gl";
import { SmokingArea } from "../types";
import "./CleanShibuyaMap.css";

interface CleanShibuyaMapProps {
  smokingAreas: SmokingArea[];
}

const CleanShibuyaMap: React.FC<CleanShibuyaMapProps> = ({ smokingAreas }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [selectedArea, setSelectedArea] = useState<SmokingArea | null>(null);

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

  // 混雑レベルに応じた色を取得
  const getCongestionColor = (level: string) => {
    switch (level) {
      case "low":
        return "#22c55e"; // 緑色
      case "medium":
        return "#f59e0b"; // オレンジ色
      case "high":
        return "#ef4444"; // 赤色
      default:
        return "#6b7280"; // グレー
    }
  };

  // 混雑レベルに応じたテキストを取得
  const getCongestionText = (level: string) => {
    switch (level) {
      case "low":
        return "空いています";
      case "medium":
        return "やや混雑";
      case "high":
        return "混雑中";
      default:
        return "不明";
    }
  };

  // 営業時間のチェック
  const isCurrentlyOpen = (area: SmokingArea) => {
    if (area.operatingHours.start === "24時間") return true;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    const [startHour, startMinute] = area.operatingHours.start
      .split(":")
      .map(Number);
    const [endHour, endMinute] = area.operatingHours.end.split(":").map(Number);
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    return currentTime >= startTime && currentTime <= endTime;
  };

  // 喫煙所のマーカーを作成する関数
  const createSmokingAreaMarkers = useCallback(
    (map: mapboxgl.Map) => {
      smokingAreas.forEach((area) => {
        const isOpen = isCurrentlyOpen(area);
        const markerColor = isOpen
          ? getCongestionColor(area.congestionLevel)
          : "#6b7280";

        // カスタムマーカー要素を作成
        const markerElement = document.createElement("div");
        markerElement.className = "smoking-area-marker";
        markerElement.style.cssText = `
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: ${markerColor};
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 12px;
        `;
        markerElement.innerHTML = "🚬";

        const marker = new mapboxgl.Marker({ element: markerElement });

        // ポップアップの内容を作成
        const popupContent = `
          <div style="
            padding: 16px; 
            width:200px; 
            max-width: 90vw;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: white;
            box-sizing: border-box;
            overflow: hidden;
          ">
            <div style="
              font-weight: 700; 
              font-size: 16px;
              color: #1f2937; 
              margin-bottom: 12px;
              padding-bottom: 8px;
              border-bottom: 2px solid #e5e7eb;
              word-wrap: break-word;
              line-height: 1.3;
            ">${area.name}</div>
            
            <div style="
              margin-bottom: 12px; 
              color: #4b5563; 
              font-size: 13px;
              line-height: 1.3;
              word-wrap: break-word;
            ">${area.address}</div>
            
            <div style="
              margin: 0 0 14px 0;
              padding: 8px;
              background: #f9fafb;
              border-radius: 6px;
              width: 100%;
              box-sizing: border-box;
            ">
              <div style="text-align: center; margin-bottom: 10px;">
                <div style="font-size: 22px; font-weight: bold; color: ${markerColor};">
                  ${area.currentOccupancy}/${area.capacity}
                </div>
                <div style="font-size: 11px; color: #6b7280;">現在の利用者</div>
              </div>
              <div style="text-align: center;">
                <div style="
                  font-size: 15px; 
                  font-weight: bold; 
                  color: ${markerColor};
                  margin-bottom: 2px;
                ">
                  ${getCongestionText(area.congestionLevel)}
                </div>
                <div style="font-size: 11px; color: #6b7280;">混雑状況</div>
              </div>
            </div>
            
            <div style="margin-bottom: 12px;">
              <div style="
                font-weight: 600; 
                font-size: 13px; 
                color: #374151;
                margin-bottom: 6px;
              ">営業時間</div>
              <div style="
                font-size: 13px; 
                color: ${isOpen ? "#22c55e" : "#ef4444"};
                font-weight: 500;
                line-height: 1.3;
              ">
                ${
                  area.operatingHours.start === "24時間"
                    ? "24時間営業"
                    : `${area.operatingHours.start} - ${area.operatingHours.end}`
                }
                ${isOpen ? " (営業中)" : " (営業時間外)"}
              </div>
            </div>
            
            <div style="margin-bottom: 12px;">
              <div style="
                font-weight: 600; 
                font-size: 13px; 
                color: #374151;
                margin-bottom: 6px;
              ">設備</div>
              <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                ${area.amenities
                  .map(
                    (amenity) => `
                  <span style="
                    background: #e5e7eb;
                    color: #374151;
                    padding: 3px 8px;
                    border-radius: 12px;
                    font-size: 11px;
                    white-space: nowrap;
                  ">${amenity}</span>
                `
                  )
                  .join("")}
              </div>
            </div>
            
            <div style="
              font-size: 11px; 
              color: #9ca3af;
              text-align: center;
              padding-top: 8px;
              border-top: 1px solid #e5e7eb;
            ">
              最終更新: ${new Date(area.lastUpdated).toLocaleString("ja-JP", {
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

        // マーカーをクリックしたときの処理
        markerElement.addEventListener("click", () => {
          setSelectedArea(area);
        });

        // マーカーを地図に追加
        marker
          .setLngLat([area.location.lng, area.location.lat])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.push(marker);
      });
    },
    [smokingAreas]
  );

  // 喫煙所データが更新されたときにマーカーを更新
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // 既存のマーカーをクリア
    clearMarkers();

    // 新しいマーカーを作成
    if (smokingAreas.length > 0) {
      createSmokingAreaMarkers(map);
    }

    // クリーンアップ関数
    return () => {
      clearMarkers();
    };
  }, [smokingAreas, createSmokingAreaMarkers]);

  return (
    <div className="clean-shibuya-map-container">
      <div className="map-header">
        <h1>Clean Shibuya Map</h1>
        <p>喫煙所の位置と混雑状況をリアルタイムで確認できます</p>
      </div>

      <div className="legend">
        <div className="legend-item">
          <div
            className="legend-color"
            style={{ backgroundColor: "#22c55e" }}
          ></div>
          <span>空いています</span>
        </div>
        <div className="legend-item">
          <div
            className="legend-color"
            style={{ backgroundColor: "#f59e0b" }}
          ></div>
          <span>やや混雑</span>
        </div>
        <div className="legend-item">
          <div
            className="legend-color"
            style={{ backgroundColor: "#ef4444" }}
          ></div>
          <span>混雑中</span>
        </div>
        <div className="legend-item">
          <div
            className="legend-color"
            style={{ backgroundColor: "#6b7280" }}
          ></div>
          <span>営業時間外</span>
        </div>
      </div>

      <div ref={mapContainer} className="clean-map" />

      {selectedArea && (
        <div className="area-details">
          <h3>{selectedArea.name}</h3>
          <p>
            現在の利用者: {selectedArea.currentOccupancy}/
            {selectedArea.capacity}人
          </p>
          <p>混雑状況: {getCongestionText(selectedArea.congestionLevel)}</p>
        </div>
      )}
    </div>
  );
};

export default CleanShibuyaMap;
