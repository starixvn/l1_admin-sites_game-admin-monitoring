import React from "react";
import type { SuggestionRound } from "../types";

interface SuggestionRoundsProps {
  rounds: SuggestionRound[];
  selectedRoundId: string | null;
  onSelectRound: (roundId: string) => void;
  loading: boolean;
}

const SuggestionRounds: React.FC<SuggestionRoundsProps> = ({
  rounds,
  selectedRoundId,
  onSelectRound,
  loading,
}) => {
  const getRoundSummary = (round: SuggestionRound): string => {
    const totalSymbolWins = round.tumbles.reduce(
      (total, tumble) => total + tumble.clusterWin.length,
      0,
    );
    const totalTumbles = round.tumbles.length;
    const rageMeter = round.rageMeter;

    return `Rage: ${rageMeter} | ${totalTumbles} tumble(s) | ${totalSymbolWins} symbol win(s)`;
  };

  const getDetailedSummary = (round: SuggestionRound): string => {
    const details = round.tumbles.map((tumble, tumbleIndex) => {
      const clusterDetails = tumble.clusterWin
        .map(
          (cw) =>
            `Symbol ${cw.symbol} (size ${cw.size}, multiplier ${cw.multiplier})`,
        )
        .join(", ");
      return `Tumble ${tumbleIndex + 1}: ${clusterDetails}`;
    });

    return details.join(" | ");
  };

  if (loading) {
    return (
      <div className="suggestion-rounds">
        <h3>Suggestion Rounds</h3>
        <div className="loading">
          <p>Loading suggestion rounds...</p>
        </div>
      </div>
    );
  }

  if (rounds.length === 0) {
    return (
      <div className="suggestion-rounds">
        <h3>Suggestion Rounds</h3>
        <div className="no-rounds">
          <p>
            No suggestion rounds available. Please submit the form to get
            suggestions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="suggestion-rounds">
      <h3>Suggestion Rounds ({rounds.length})</h3>
      <div className="rounds-list">
        {rounds.map((round) => (
          <div
            key={round.roundInfoId}
            className={`round-item ${
              selectedRoundId === round.roundInfoId ? "selected" : ""
            }`}
            onClick={() => onSelectRound(round.roundInfoId)}
          >
            <div className="round-summary">{getRoundSummary(round)}</div>
            <div className="round-details">{getDetailedSummary(round)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionRounds;
