import React, { useEffect, useState } from "react";
import type { RoundInfo, RageMeterConfig, FreeSpinGroup } from "../types";
import RageMeterBar from "./RageMeterBar";
import { apiService } from "../api";

interface GameBoardProps {
  roundInfo: RoundInfo | null;
  rageMeterConfig: RageMeterConfig;
  nickname: string;
  freeSpinGroup?: FreeSpinGroup;
}

const GameBoard: React.FC<GameBoardProps> = ({
  roundInfo,
  rageMeterConfig,
  nickname,
  freeSpinGroup,
}) => {
  const [isSettingResult, setIsSettingResult] = useState(false);
  const [currentTumbleIndex, setCurrentTumbleIndex] = useState(0);

  const [selectedRound, setSelectedRound] = useState<RoundInfo | null>(null);
  useEffect(() => {
    setSelectedRound(roundInfo);
  }, [roundInfo]);

  // Reset tumble index when selected round changes
  useEffect(() => {
    setCurrentTumbleIndex(0);
  }, [selectedRound]);

  const handleSetResult = async () => {
    if (!roundInfo || !nickname.trim()) {
      alert("Round info and nickname are required to set result.");
      return;
    }

    setIsSettingResult(true);
    try {
      await apiService.setResult({
        name: nickname,
        result: freeSpinGroup ? freeSpinGroup : roundInfo,
      });
      alert("Result set successfully!");
    } catch (error) {
      console.error("Error setting result:", error);
      alert("Failed to set result. Please try again.");
    } finally {
      setIsSettingResult(false);
    }
  };

  const handleExportJson = () => {
    if (!roundInfo || !nickname.trim()) {
      alert("Round info and nickname are required to export JSON.");
      return;
    }

    const exportData = { name: nickname, result: roundInfo };
    const jsonString = JSON.stringify(exportData, null, 2);

    // Create a blob with the JSON data
    const blob = new Blob([jsonString], { type: "application/json" });

    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `round-result-${roundInfo.id}-${nickname}.json`;

    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    URL.revokeObjectURL(url);

    alert("JSON file exported successfully!");
  };

  if (!selectedRound) {
    return (
      <div className="game-board">
        <div className="no-data">
          <p>
            No round data available. Please select a suggestion round first.
          </p>
        </div>
      </div>
    );
  }

  const currentTumble = selectedRound.tumbles[currentTumbleIndex];
  if (!currentTumble || currentTumbleIndex >= selectedRound.tumbles.length) {
    return (
      <div className="game-board">
        <div className="no-data">
          <p>Invalid tumble index or no tumble data available.</p>
        </div>
      </div>
    );
  }

  const { reels, reelMultipliers, rageMeter } = currentTumble;

  const symbols =
    currentTumbleIndex === selectedRound.tumbles.length - 1
      ? []
      : selectedRound.tumbles[currentTumbleIndex + 1].symbols;
  const triggeredPositions =
    currentTumbleIndex === selectedRound.tumbles.length - 1
      ? []
      : selectedRound.tumbles[currentTumbleIndex + 1].triggeredPositions;

  // Create a map of winning positions for highlighting
  // Note: pos.x is column (reel), pos.y is row within that column
  const winningPositions = new Set<string>();
  symbols.forEach((symbol) => {
    symbol.position.forEach((pos) => {
      winningPositions.add(`${pos.x},${pos.y}`);
    });
  });

  // Create a map of feature trigger positions
  const featurePositions = new Set<string>();
  if (triggeredPositions) {
    triggeredPositions.forEach((pos) => {
      featurePositions.add(`${pos.x},${pos.y}`);
    });
  }

  const getSymbolColor = (symbol: number): string => {
    const colors = [
      "#FF6B6B", // 0 - Red
      "#4ECDC4", // 1 - Teal
      "#45B7D1", // 2 - Blue
      "#96CEB4", // 3 - Green
      "#FFEAA7", // 4 - Yellow
      "#DDA0DD", // 5 - Plum
      "#98D8C8", // 6 - Mint
      "#F7DC6F", // 7 - Gold
    ];
    return colors[symbol] || "#CCCCCC";
  };

  const numRows = reels.length > 0 ? reels[0].length : 0;
  const numCols = reels.length;

  const getMultiplierColor = (mult: number): string => {
    if (mult === -1) {
      return "transparent";
    }
    if (mult === 0) {
      return "#E8F4FD";
    }
    if (mult <= 5) {
      return "#FFE5E5";
    }
    if (mult <= 10) {
      return "#FFCCCC";
    }
    if (mult <= 20) {
      return "#FF9999";
    }
    return "#FF6666";
  };

  const handleRoundSelect = (round: RoundInfo | null) => {
    if (round) {
      setSelectedRound(round);
      setCurrentTumbleIndex(0);
    }
  };

  return (
    <div className="game-board">
      <div className="board-header">
        <h3>Board</h3>
        <div className="board-info">
          <div className="action-list">
            <button
              className="btn-control set-result-btn"
              onClick={handleSetResult}
              disabled={isSettingResult}
            >
              {isSettingResult ? "Setting..." : "Set Result"}
            </button>
            <button className="btn-control set-result-btn">Import</button>
            <button
              className="btn-control set-result-btn"
              onClick={handleExportJson}
            >
              Export JSON
            </button>
          </div>
          <div className="info-item">
            <span className="label">Total Win:</span>
            <span className="value">{selectedRound.totalWin.toFixed(2)}x</span>
          </div>
          <div className="info-item">
            <span className="label">Tumble:</span>
            <span className="value">
              {currentTumbleIndex + 1} / {selectedRound.tumbles.length}
            </span>
          </div>
        </div>
      </div>

      {/* Compact Rage Meter Visualization */}
      <div className="game-board-rage-meter">
        <div className="rage-meter-header">
          <span className="rage-meter-title">Rage Meter</span>
          <span className="rage-meter-value">{Math.max(0, rageMeter)}</span>
        </div>
        <RageMeterBar
          rageMeter={rageMeter}
          config={rageMeterConfig}
          showLabels={false}
          className="game-board-rage-bar"
        />
      </div>

      <div className="tumble-navigation">
        <button
          onClick={() => setCurrentTumbleIndex(currentTumbleIndex - 1)}
          className="btn-control"
          disabled={currentTumbleIndex === 0}
        >
          Previous
        </button>
        <span>Tumble {currentTumbleIndex + 1}</span>
        <button
          className="btn-control"
          onClick={() => setCurrentTumbleIndex(currentTumbleIndex + 1)}
          disabled={currentTumbleIndex === selectedRound.tumbles.length - 1}
        >
          Next
        </button>
      </div>

      <div className="board-container">
        <div className="board">
          {/* Render rows first, then columns within each row */}
          {Array.from({ length: numRows }, (_, rowIndex) => (
            <div key={rowIndex} className="board-row">
              {Array.from({ length: numCols }, (_, colIndex) => {
                const symbol = reels[colIndex][rowIndex];
                const mult = reelMultipliers[colIndex][rowIndex];
                const isWinning = winningPositions.has(
                  `${colIndex},${rowIndex}`,
                );
                const isFeature = featurePositions.has(
                  `${colIndex},${rowIndex}`,
                );

                return (
                  <div
                    key={`${colIndex}-${rowIndex}`}
                    className={`board-cell ${isWinning ? "winning" : ""} ${
                      isFeature ? "feature" : ""
                    }`}
                    style={{
                      backgroundColor: getSymbolColor(symbol),
                      border: isWinning
                        ? "3px solid #FFD700"
                        : "1px solid #333",
                      position: "relative",
                    }}
                  >
                    <div className="symbol">{symbol}</div>
                    {mult !== -1 && (
                      <div
                        className="multiplier"
                        style={{ backgroundColor: getMultiplierColor(mult) }}
                      >
                        {mult > 0 ? `x${mult}` : ""}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {freeSpinGroup && (
        <select
          onChange={(e) =>
            handleRoundSelect(
              e.target.value === freeSpinGroup.rootRound.id
                ? freeSpinGroup.rootRound
                : freeSpinGroup.freeSpinRounds.find(
                    (round) => round.id === e.target.value,
                  ) ?? null,
            )
          }
          value={selectedRound?.id || ""}
        >
          <option value={freeSpinGroup.rootRound.id}>
            {`Root - Scatter (${freeSpinGroup.rootRound.scatterCount}) - Rage (${freeSpinGroup.rootRound.rageMeter}) - Tumbles (${freeSpinGroup.rootRound.tumbles.length})`}
          </option>
          {freeSpinGroup.freeSpinRounds.map((round) => (
            <option key={round.id} value={round.id}>
              {`Free Spin ${round.order} - Scatter (${round.scatterCount}) - Rage (${round.rageMeter}) - Tumbles (${round.tumbles.length})`}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default GameBoard;
