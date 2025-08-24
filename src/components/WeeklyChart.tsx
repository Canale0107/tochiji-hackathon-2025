import React, { useEffect, useRef } from "react";
import { SmokingArea } from "../types";
import "./WeeklyChart.css";

interface WeeklyChartProps {
  smokingArea: SmokingArea;
}

const WeeklyChart: React.FC<WeeklyChartProps> = ({ smokingArea }) => {
  const currentDay = new Date().getDay();
  const chartRef = useRef<HTMLDivElement>(null);

  // 曜日名の配列
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];

  // 最大値を取得してスケールを調整
  const maxUsers = Math.max(
    ...smokingArea.weeklyUsage.map((d) => d.averageUsers)
  );
  // チャートの高さに対する比率を計算（最大値が80%の高さになるように）
  const getBarHeight = (users: number) => {
    if (maxUsers === 0) return 10;
    const percentage = (users / maxUsers) * 80; // 最大80%
    return Math.max(percentage, 10); // 最低10%
  };

  // DOM要素の高さを直接設定
  useEffect(() => {
    if (chartRef.current) {
      const bars = chartRef.current.querySelectorAll(".bar");
      bars.forEach((bar, index) => {
        const dayData = smokingArea.weeklyUsage[index];
        if (dayData) {
          const height = getBarHeight(dayData.averageUsers);
          (bar as HTMLElement).style.height = `${height}%`;
        }
      });
    }
  }, [smokingArea]);

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

  return (
    <div className="weekly-chart" ref={chartRef}>
      <h3>曜日別平均混雑度</h3>
      <div className="chart-container">
        <div className="chart-bars">
          {smokingArea.weeklyUsage.map((dayData) => (
            <div key={dayData.dayOfWeek} className="bar-container">
              <div
                className={`bar ${
                  dayData.dayOfWeek === currentDay ? "current-day" : ""
                }`}
                style={{
                  backgroundColor:
                    dayData.dayOfWeek === currentDay
                      ? "#3b82f6"
                      : getCongestionColor(dayData.congestionLevel),
                  minHeight: "20px",
                }}
              >
                <div className="bar-value">{dayData.averageUsers}</div>
                <div className="peak-time">ピーク: {dayData.peakHour}時</div>
              </div>
              <div className="day-label">
                {dayNames[dayData.dayOfWeek]}
                {dayData.dayOfWeek === currentDay && (
                  <span className="current-indicator">●</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="chart-info">
          <div className="info-item">
            <strong>最も混雑する曜日:</strong>{" "}
            {
              dayNames[
                smokingArea.weeklyUsage[
                  smokingArea.weeklyUsage.reduce(
                    (max, day, index) =>
                      day.averageUsers >
                      smokingArea.weeklyUsage[max].averageUsers
                        ? index
                        : max,
                    0
                  )
                ].dayOfWeek
              ]
            }
          </div>
          <div className="info-item">
            <strong>最も空いている曜日:</strong>{" "}
            {
              dayNames[
                smokingArea.weeklyUsage[
                  smokingArea.weeklyUsage.reduce(
                    (min, day, index) =>
                      day.averageUsers <
                      smokingArea.weeklyUsage[min].averageUsers
                        ? index
                        : min,
                    0
                  )
                ].dayOfWeek
              ]
            }
          </div>
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
            <span>今日</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyChart;
