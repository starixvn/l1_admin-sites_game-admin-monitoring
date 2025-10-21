import React, { useState } from "react";
import type {
  FormData,
  Tumble,
  SuggestionRound,
  RoundInfo,
  RageMeterConfig,
} from "./types";
import { apiService } from "./api";
import TumbleInput from "./Components/TumbleInput";
import RageMeterConfigComponent from "./Components/RageMeterConfig";
import SuggestionRounds from "./Components/SuggestionRounds";
import GameBoard from "./Components/GameBoard";

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nickname: "",
    tumbles: [],
    multiplier: 0,
    rageMeter: 0,
    scatterCount: 0,
  });

  const [suggestionRounds, setSuggestionRounds] = useState<SuggestionRound[]>(
    [],
  );
  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null);
  const [roundInfo, setRoundInfo] = useState<RoundInfo | null>(null);
  const [roundInfoMap, setRoundInfoMap] = useState<Map<string, RoundInfo>>(
    new Map(),
  );
  const [loading, setLoading] = useState(false);
  const [currentTumbleIndex, setCurrentTumbleIndex] = useState(0);

  // Rage meter configuration
  const rageMeterConfig: RageMeterConfig = {
    thresholds: [15, 30, 50, 80],
    features: [
      "Basic Feature",
      "Enhanced Feature",
      "Advanced Feature",
      "Ultimate Feature",
    ],
  };

  // Add a new tumble
  const addTumble = () => {
    const newTumble: Tumble = {
      clusterWin: [],
    };
    setFormData({
      ...formData,
      tumbles: [...formData.tumbles, newTumble],
    });
  };

  // Update a tumble
  const updateTumble = (index: number, updatedTumble: Tumble) => {
    const updatedTumbles = [...formData.tumbles];
    updatedTumbles[index] = updatedTumble;
    setFormData({
      ...formData,
      tumbles: updatedTumbles,
    });
  };

  // Delete a tumble
  const deleteTumble = (index: number) => {
    const updatedTumbles = formData.tumbles.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      tumbles: updatedTumbles,
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate nickname is required
    if (!formData.nickname.trim()) {
      alert("Please enter a nickname.");
      return;
    }

    // Validate at least one of multiplier, rage meter, or tumbles has a value
    const hasTumbles = formData.tumbles.length > 0;
    const hasMultiplier = formData.multiplier > 0;
    const hasRageMeter = formData.rageMeter > 0;
    const hasScatter = formData.scatterCount > 0;

    if (!hasTumbles && !hasMultiplier && !hasRageMeter && !hasScatter) {
      alert(
        "Please provide at least one of: tumbles, multiplier > 0, or rage meter > 0, or scatter count > 0.",
      );
      return;
    }

    if (formData.tumbles.length > 0) {
      formData.tumbles.forEach((tumble) => {
        if (tumble.clusterWin.length === 0) {
          alert("Please add at least one cluster win to each tumble.");
          return;
        }
        if (tumble.clusterWin.some((clusterWin) => clusterWin.symbol === -1)) {
          alert("Please add a symbol to each cluster win.");
          return;
        }
        if (tumble.clusterWin.some((clusterWin) => clusterWin.size === -1)) {
          alert("Please add a size to each cluster win.");
        }
      });
    }

    setLoading(true);
    try {
      const response = await apiService.getSuggestionRounds(formData);
      const rounds = response.rounds;
      setSuggestionRounds(rounds);

      if (rounds.length > 0) {
        setRoundInfoMap((prevMap) => {
          const newMap = new Map(prevMap);
          newMap.set(response.exampleRound.id, response.exampleRound);
          return newMap;
        });

        setRoundInfo(response.exampleRound);
        setCurrentTumbleIndex(0);
        setSelectedRoundId(rounds[0].roundInfoId);
      }
    } catch (error) {
      console.error("Error getting suggestion rounds:", error);
      alert("Error getting suggestion rounds. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadRoundInfo = async (roundId: string) => {
    if (roundInfoMap.has(roundId)) {
      const cachedInfo = roundInfoMap.get(roundId) ?? null;
      setRoundInfo(cachedInfo);
      setCurrentTumbleIndex(0);
      return;
    }

    try {
      const info = await apiService.getRoundInfo(roundId);

      setRoundInfoMap((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.set(roundId, info);
        return newMap;
      });

      setRoundInfo(info);
      setCurrentTumbleIndex(0);
    } catch (error) {
      console.error("Error loading round info:", error);
      alert("Error loading round info. Please try again.");
    }
  };

  const handleRoundSelect = async (roundId: string) => {
    setSelectedRoundId(roundId);
    await loadRoundInfo(roundId);
  };

  const handleTumbleChange = (index: number) => {
    if (roundInfo && index >= 0 && index < roundInfo.tumbles.length) {
      setCurrentTumbleIndex(index);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Gold And Dragon Result Control System</h1>
        <p>Configure game parameters and visualize cluster slot results</p>
      </header>

      <div className="app-content">
        <div className="form-section">
          <div className="form">
            <div className="form-group">
              <label htmlFor="nickname" className="required">
                Nickname *
              </label>
              <input
                id="nickname"
                type="text"
                value={formData.nickname}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nickname: e.target.value,
                  })
                }
                placeholder="Enter player nickname"
                required
              />
            </div>

            <div className="form-group">
              <label>Multiplier:</label>
              <input
                type="number"
                value={formData.multiplier === -1 ? "" : formData.multiplier}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    multiplier: parseInt(e.target.value) || -1,
                  })
                }
                placeholder="Multiplier"
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Number of Scatter:</label>
              <input
                type="number"
                value={
                  formData.scatterCount === -1 ? "" : formData.scatterCount
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    scatterCount: parseInt(e.target.value) || -1,
                  })
                }
                placeholder="Number of Scatter"
                min="0"
              />
            </div>

            <RageMeterConfigComponent
              rageMeter={formData.rageMeter}
              onRageMeterChange={(value: number) =>
                setFormData({
                  ...formData,
                  rageMeter: value,
                })
              }
              config={rageMeterConfig}
            />

            <div className="tumble-section">
              <div className="section-header">
                <h3>Tumbles ({formData.tumbles.length})</h3>
                <button className="add-btn btn-control" onClick={addTumble}>
                  Add Tumble
                </button>
              </div>

              <div className="tumble-list">
                {formData.tumbles.map((tumble, index) => (
                  <TumbleInput
                    key={index}
                    tumble={tumble}
                    onUpdate={(updatedTumble) =>
                      updateTumble(index, updatedTumble)
                    }
                    onDelete={() => deleteTumble(index)}
                  />
                ))}
                {formData.tumbles.length === 0 && (
                  <p className="empty-message">
                    No tumbles added yet. Click "Add Tumble" to get started.
                  </p>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button
                className="submit-btn btn-control"
                onClick={handleSubmit}
                disabled={loading || !formData.nickname.trim()}
              >
                {loading ? "Getting Suggestions..." : "Get Suggestion Rounds"}
              </button>
            </div>
          </div>
        </div>

        <div className="results-section">
          <SuggestionRounds
            rounds={suggestionRounds}
            selectedRoundId={selectedRoundId}
            onSelectRound={handleRoundSelect}
            loading={loading}
          />

          <GameBoard
            roundInfo={roundInfo}
            currentTumbleIndex={currentTumbleIndex}
            onTumbleChange={handleTumbleChange}
            rageMeterConfig={rageMeterConfig}
            nickname={formData.nickname}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
