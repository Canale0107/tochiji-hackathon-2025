import React, { useState } from "react";
import { CongestionReport, SmokingArea } from "../types";
import { saveCongestionReport } from "../utils/dataLoader";
import "./CongestionReportForm.css";

interface CongestionReportFormProps {
  smokingAreas: SmokingArea[];
  onAddReport: (report: CongestionReport) => void;
  selectedLanguage: "ja" | "en" | "zh" | "ko";
  onClose: () => void;
}

const CongestionReportForm: React.FC<CongestionReportFormProps> = ({
  smokingAreas,
  onAddReport,
  selectedLanguage,
  onClose,
}) => {
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [congestionLevel, setCongestionLevel] = useState<
    "low" | "medium" | "high"
  >("medium");
  const [currentUsers, setCurrentUsers] = useState<number>(1);
  const [author, setAuthor] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const selectedSmokingArea = smokingAreas.find(
    (area) => area.id === selectedArea
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSmokingArea) return;

    setIsSubmitting(true);

    const newReport: CongestionReport = {
      id: Date.now().toString(),
      smokingAreaId: selectedSmokingArea.id,
      smokingAreaName: selectedSmokingArea.name,
      location: selectedSmokingArea.location,
      congestionLevel,
      currentUsers,
      capacity: selectedSmokingArea.capacity,
      timestamp: new Date(),
      author,
      comment: comment.trim() || undefined,
      language: selectedLanguage,
    };

    try {
      await saveCongestionReport(newReport);
      onAddReport(newReport);
      onClose();
    } catch (error) {
      console.error("Error saving congestion report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="congestion-report-form-overlay">
      <div className="congestion-report-form">
        <div className="form-header">
          <h3>🚬 混雑度を投稿</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>喫煙所を選択</label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              required
            >
              <option value="">喫煙所を選択してください</option>
              {smokingAreas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name} (定員: {area.capacity}人)
                </option>
              ))}
            </select>
          </div>

          {selectedSmokingArea && (
            <div className="selected-area-info">
              <h4>選択された喫煙所</h4>
              <p>
                <strong>{selectedSmokingArea.name}</strong>
              </p>
              <p>住所: {selectedSmokingArea.address}</p>
              <p>定員: {selectedSmokingArea.capacity}人</p>
              <p>
                営業時間: {selectedSmokingArea.operatingHours.start} -{" "}
                {selectedSmokingArea.operatingHours.end}
              </p>
            </div>
          )}

          <div className="form-group">
            <label>混雑レベル</label>
            <div className="congestion-level-buttons">
              {(["low", "medium", "high"] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`congestion-level-button ${
                    congestionLevel === level ? "active" : ""
                  }`}
                  onClick={() => setCongestionLevel(level)}
                  style={{
                    borderColor: getCongestionLevelColor(level),
                    backgroundColor:
                      congestionLevel === level
                        ? getCongestionLevelColor(level)
                        : "transparent",
                    color:
                      congestionLevel === level
                        ? "white"
                        : getCongestionLevelColor(level),
                  }}
                >
                  {getCongestionLevelLabel(level)}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>現在の使用者数</label>
            <input
              type="number"
              min="0"
              max={selectedSmokingArea?.capacity || 100}
              value={currentUsers}
              onChange={(e) => setCurrentUsers(parseInt(e.target.value) || 0)}
              required
            />
            {selectedSmokingArea && (
              <small>最大: {selectedSmokingArea.capacity}人</small>
            )}
          </div>

          <div className="form-group">
            <label>投稿者名</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="あなたの名前"
              required
            />
          </div>

          <div className="form-group">
            <label>コメント（任意）</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="混雑状況について詳しく教えてください"
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              キャンセル
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "投稿中..." : "投稿する"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CongestionReportForm;
