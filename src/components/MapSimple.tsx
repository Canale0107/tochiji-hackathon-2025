import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";

const MapSimple: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // アクセストークンを設定
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || "";

    // 地図を作成
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [139.7670516, 35.6811673],
      zoom: 15,
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

export default MapSimple;
