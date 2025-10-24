import React, { useState } from "react";
import type {
  FormData,
  Tumble,
  SuggestionRound,
  RoundInfo,
  RageMeterConfig,
  FreeSpinGroup,
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
    isFreeSpin: false,
  });

  const [freeSpinGroup, setFreeSpinGroup] = useState<FreeSpinGroup | undefined>(
    undefined,
  );
  const [freeSpinGroupMap, setFreeSpinGroupMap] = useState<
    Map<string, FreeSpinGroup>
  >(new Map());
  const [suggestionRounds, setSuggestionRounds] = useState<SuggestionRound[]>(
    [],
  );
  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null);
  const [roundInfo, setRoundInfo] = useState<RoundInfo | null>(null);
  const [roundInfoMap, setRoundInfoMap] = useState<Map<string, RoundInfo>>(
    new Map(),
  );
  const [loading, setLoading] = useState(false);

  const rageMeterConfig: RageMeterConfig = {
    thresholds: [12, 25, 40, 60],
    features: [
      "Rage Feature 1",
      "Rage Feature 2",
      "Rage Feature 3",
      "Rage Feature 4",
    ],
  };

  const addTumble = () => {
    const newTumble: Tumble = {
      clusterWin: [],
    };
    setFormData({
      ...formData,
      tumbles: [...formData.tumbles, newTumble],
    });
  };

  const updateTumble = (index: number, updatedTumble: Tumble) => {
    const updatedTumbles = [...formData.tumbles];
    updatedTumbles[index] = updatedTumble;
    setFormData({
      ...formData,
      tumbles: updatedTumbles,
    });
  };

  const deleteTumble = (index: number) => {
    const updatedTumbles = formData.tumbles.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      tumbles: updatedTumbles,
    });
  };
  const resetSelectedRound = () => {
    setSelectedRoundId(null);
    setRoundInfo(null);
    setFreeSpinGroup(undefined);
  };

  const handleSubmit = async () => {
    if (!formData.nickname.trim()) {
      alert("Please enter a nickname.");
      return;
    }

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
    resetSelectedRound();
    try {
      const response = await apiService.getSuggestionRounds(formData);
      const { rounds, exampleFreeSpinRoundGroup } = response;
      if (exampleFreeSpinRoundGroup) {
        setFreeSpinGroupMap((prevMap) => {
          const newMap = new Map(prevMap);
          newMap.set(
            exampleFreeSpinRoundGroup.rootRound.id,
            exampleFreeSpinRoundGroup,
          );
          return newMap;
        });
        setFreeSpinGroup(exampleFreeSpinRoundGroup);
      }
      setSuggestionRounds(rounds);

      if (rounds.length > 0) {
        setRoundInfoMap((prevMap) => {
          const newMap = new Map(prevMap);
          newMap.set(response.exampleRound.id, response.exampleRound);
          return newMap;
        });

        setRoundInfo(response.exampleRound);
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
    } catch (error) {
      console.error("Error loading round info:", error);
      alert("Error loading round info. Please try again.");
    }
  };

  const loadFreeSpinGroup = async (
    roundId: string,
    currentRoundInfoId: string,
  ) => {
    if (freeSpinGroupMap.has(roundId)) {
      const cachedGroup = freeSpinGroupMap.get(roundId) ?? undefined;
      setFreeSpinGroup(cachedGroup);
      setRoundInfo(
        cachedGroup?.freeSpinRounds.find(
          (round) => round.id === currentRoundInfoId,
        ) ?? null,
      );
      return;
    }

    try {
      const group = await apiService.getFreeSpinRounds(roundId);
      setFreeSpinGroupMap((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.set(roundId, group);
        return newMap;
      });
      setFreeSpinGroup(group);
      setRoundInfo(
        group.freeSpinRounds.find((round) => round.id === currentRoundInfoId) ??
          null,
      );
    } catch (error) {
      console.error("Error loading free spin group:", error);
      alert("Error loading free spin group. Please try again.");
    }
  };

  const handleRoundSelect = async (round: SuggestionRound) => {
    setSelectedRoundId(round.roundInfoId);
    if (round.isFreeSpin && round.roundId) {
      await loadFreeSpinGroup(round.roundId, round.roundInfoId);
    } else {
      await loadRoundInfo(round.roundInfoId);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h2>Gold And Dragon Set Result</h2>
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

            <div className="form-group inline">
              <label>Is Free Spin:</label>
              <input
                type="checkbox"
                checked={formData.isFreeSpin}
                onChange={(e) =>
                  setFormData({ ...formData, isFreeSpin: e.target.checked })
                }
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
            freeSpinGroup={freeSpinGroup}
            roundInfo={roundInfo}
            rageMeterConfig={rageMeterConfig}
            nickname={formData.nickname}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
