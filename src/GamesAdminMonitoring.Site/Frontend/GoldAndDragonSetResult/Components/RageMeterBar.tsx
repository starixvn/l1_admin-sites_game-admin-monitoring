import React from "react";
import type { RageMeterConfig } from "../types";

interface RageMeterBarProps {
  rageMeter: number;
  config: RageMeterConfig;
  showLabels?: boolean;
  className?: string;
}

const RageMeterBar: React.FC<RageMeterBarProps> = ({
  rageMeter,
  config,
  showLabels = true,
  className = "",
}) => {
  const maxRage = Math.max(100, ...config.thresholds);
  const normalizedRageMeter = Math.max(0, rageMeter); // Ensure rage meter starts from 0
  const ragePercentage = Math.min((normalizedRageMeter / maxRage) * 100, 100);

  const getTriggeredFeatures = (currentRage: number): string[] => {
    return config.thresholds
      .map((threshold, index) => ({
        threshold,
        feature: config.features[index] || `Feature ${index + 1}`,
      }))
      .filter((item) => currentRage >= item.threshold)
      .map((item) => item.feature);
  };

  const triggeredFeatures = getTriggeredFeatures(normalizedRageMeter);

  return (
    <div className={`rage-meter-visualization ${className}`}>
      <div className="rage-meter-bar-container">
        <div className="rage-meter-bar">
          <div
            className="rage-meter-fill"
            style={{ width: `${ragePercentage}%` }}
          />
          {/* Threshold markers */}
          {config.thresholds.map((threshold, index) => {
            const thresholdPercentage = (threshold / maxRage) * 100;
            const isTriggered = normalizedRageMeter >= threshold;
            return (
              <div
                key={index}
                className={`threshold-marker ${isTriggered ? "triggered" : ""}`}
                style={{ left: `${thresholdPercentage}%` }}
                title={`${
                  config.features[index] || `Feature ${index + 1}`
                } (${threshold})`}
              />
            );
          })}
        </div>
        {showLabels && (
          <div className="rage-meter-labels">
            <span className="rage-value">{normalizedRageMeter}</span>
            <span className="rage-max">{maxRage}</span>
          </div>
        )}
      </div>
      {triggeredFeatures.length > 0 && (
        <div className="triggered-features-simple">
          <span className="label">Triggered Features:</span>
          <div className="feature-list-simple">
            {triggeredFeatures.map((feature, index) => (
              <span key={index} className="feature-tag-simple">
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RageMeterBar;
