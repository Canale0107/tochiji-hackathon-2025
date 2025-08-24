import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";

const Map: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);

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

  return (
    <div className="map-container">
      <div ref={mapContainer} className="map" />
    </div>
  );
};

export default Map;
