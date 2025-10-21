import type { FormData, RoundInfo, SuggestionResponse } from "./types";

// Mock API functions - replace with actual API calls

const SET_RESULT_API = "/monitoring/ResultMonitor";
const ENDPOINT = {
  SUGGESTION_ROUNDS: "/QuerySimulationRound/query",
  ROUND_INFO: "/QuerySimulationRound/info",
  SET_RESULT: "/SetCascadingClusterSlotResult",
};

const ROUND_SIMULATION_API =
  "https://l2-proxy2.lumigame.com/querysimulationrounds/api";

export const apiService = {
  // Get suggestion rounds based on form data
  async getSuggestionRounds(formData: FormData): Promise<SuggestionResponse> {
    try {
      const requestBody = {
        nickname: formData.nickname,
        multiplier: formData.multiplier > 0 ? formData.multiplier : undefined,
        rageMeter: formData.rageMeter > 0 ? formData.rageMeter : undefined,
        scatterCount:
          formData.scatterCount > 0 ? formData.scatterCount : undefined,
        tumblePattern:
          formData.tumbles.length > 0
            ? {
                tumbles: formData.tumbles,
              }
            : undefined,
      };

      const response = await fetch(
        `${ROUND_SIMULATION_API}${ENDPOINT.SUGGESTION_ROUNDS}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        },
      );

      return await response.json();
    } catch (error) {
      console.error("Error getting suggestion rounds:", error);
      throw error;
    }
  },

  // Get detailed round info by ID
  async getRoundInfo(roundInfoId: string): Promise<RoundInfo> {
    try {
      const response = await fetch(
        `${ROUND_SIMULATION_API}${ENDPOINT.ROUND_INFO}/${roundInfoId}`,
        {
          method: "GET",
        },
      );
      return await response.json();
    } catch (error) {
      console.error("Error getting round info:", error);
      throw error;
    }
  },

  async setResult(roundInfo: {
    name: string;
    result: RoundInfo;
  }): Promise<void> {
    try {
      const response = await fetch(`${SET_RESULT_API}${ENDPOINT.SET_RESULT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...roundInfo,
          gameConfigName:
            (document.querySelector("#root") as HTMLElement)?.dataset
              ?.gameName || "goldanddragon",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error setting result:", error);
      throw error;
    }
  },
};
