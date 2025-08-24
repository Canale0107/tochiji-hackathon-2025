import React from "react";
import { SmokingArea } from "../types";
import "./UsageChart.css";

interface UsageChartProps {
  smokingArea: SmokingArea;
}

const UsageChart: React.FC<UsageChartProps> = ({ smokingArea }) => {
  const currentHour = new Date().getHours();

  // 最大値を取得してスケールを調整
  const maxUsers = Math.max(
    ...smokingArea.hourlyUsage.map((h) => h.averageUsers)
  );
  const scale = maxUsers > 0 ? 100 / maxUsers : 1;

  return (
    <div className="usage-chart">
      <h3>時間帯別使用者数</h3>
      <div className="chart-container">
        <div className="chart-bars">
          {smokingArea.hourlyUsage.map((hourData) => (
            <div key={hourData.hour} className="bar-container">
              <div
                className={`bar ${
                  hourData.hour === currentHour ? "current-hour" : ""
                }`}
                style={{
                  height: `${hourData.averageUsers * scale}%`,
                  backgroundColor:
                    hourData.hour === currentHour
                      ? "#3b82f6"
                      : hourData.averageUsers / smokingArea.capacity > 0.8
                      ? "#ef4444"
                      : hourData.averageUsers / smokingArea.capacity > 0.5
                      ? "#f59e0b"
                      : "#22c55e",
                }}
              >
                <div className="bar-value">{hourData.averageUsers}</div>
              </div>
              <div className="hour-label">{hourData.hour}</div>
            </div>
          ))}
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: "#22c55e" }}
            ></div>
            <span>空き</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: "#f59e0b" }}
            ></div>
            <span>普通</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: "#ef4444" }}
            ></div>
            <span>混雑</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: "#3b82f6" }}
            ></div>
            <span>現在時刻</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageChart;
