import React from "react";
import { CongestionReport } from "../types";
import "./CongestionReportsList.css";

interface CongestionReportsListProps {
  reports: CongestionReport[];
  selectedLanguage: "ja" | "en" | "zh" | "ko";
}

const CongestionReportsList: React.FC<CongestionReportsListProps> = ({
  reports,
  selectedLanguage,
}) => {
  const getCongestionLevelLabel = (level: string) => {
    switch (level) {
      case "low":
        return "空き";
      case "medium":
        return "普通";
      case "high":
        return "混雑";
      default:
        return level;
    }
  };

  const getCongestionLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "#22c55e";
      case "medium":
        return "#f59e0b";
      case "high":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getLanguageName = (code: string) => {
    const languages = [
      { code: "ja", name: "日本語" },
      { code: "en", name: "English" },
      { code: "zh", name: "中文" },
      { code: "ko", name: "한국어" },
    ];
    return languages.find((lang) => lang.code === code)?.name || code;
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "今";
    if (minutes < 60) return `${minutes}分前`;
    if (hours < 24) return `${hours}時間前`;
    if (days < 7) return `${days}日前`;
    return timestamp.toLocaleDateString("ja-JP");
  };

  if (reports.length === 0) {
    return (
      <div className="congestion-reports-list">
        <h3>🚬 混雑度投稿</h3>
        <div className="empty-state">
          <p>まだ混雑度の投稿がありません</p>
          <p className="empty-state-subtitle">最初の投稿をしてみましょう！</p>
        </div>
      </div>
    );
  }

  return (
    <div className="congestion-reports-list">
      <h3>🚬 混雑度投稿</h3>
      <div className="reports-container">
        {reports
          .sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
          .map((report) => (
            <div key={report.id} className="report-item">
              <div className="report-header">
                <div className="report-title">
                  <h4>{report.smokingAreaName}</h4>
                  <span className="report-language">
                    {getLanguageName(report.language)}
                  </span>
                </div>
                <div className="report-timestamp">
                  {formatTimestamp(report.timestamp)}
                </div>
              </div>

              <div className="report-content">
                <div className="congestion-info">
                  <div className="congestion-level">
                    <span
                      className="congestion-badge"
                      style={{
                        backgroundColor: getCongestionLevelColor(
                          report.congestionLevel
                        ),
                        color: "white",
                      }}
                    >
                      {getCongestionLevelLabel(report.congestionLevel)}
                    </span>
                  </div>
                  <div className="users-info">
                    <span className="current-users">
                      {report.currentUsers}人
                    </span>
                    <span className="separator">/</span>
                    <span className="capacity">{report.capacity}人</span>
                  </div>
                </div>

                {report.comment && (
                  <div className="report-comment">
                    <p>{report.comment}</p>
                  </div>
                )}

                <div className="report-footer">
                  <span className="report-author">by {report.author}</span>
                  <span className="report-location">
                    📍 {report.location.lat.toFixed(4)},{" "}
                    {report.location.lng.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CongestionReportsList;
