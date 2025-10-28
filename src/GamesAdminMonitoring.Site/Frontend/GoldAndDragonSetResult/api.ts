import type {
  FormData,
  FreeSpinGroup,
  RoundInfo,
  SuggestionResponse,
} from "./types";

const SET_RESULT_API = "/monitoring/ResultMonitor";
const ENDPOINT = {
  SUGGESTION_ROUNDS: "/GoldAndDragon/query",
  ROUND_INFO: "/GoldAndDragon/info",
  FREE_SPIN_ROUND_INFO: "/GoldAndDragon/free-spin-info",
  SET_RESULT: "/SetCascadingClusterSlotResult",
};

const ROUND_SIMULATION_API =
  "https://l2-proxy2.lumigame.com/querysimulationrounds/api";

export const apiService = {
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
        isFreeSpin: formData.isFreeSpin,
        ...(formData.fromBuyFreeSpin && { buyFreeSpinMode: 1 }),
        ...(formData.fromBuySupperFreeSpin && { buyFreeSpinMode: 2 }),
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

  async getFreeSpinRounds(
    roundInfoId: string,
    buyFreeSpinMode?: number,
  ): Promise<FreeSpinGroup> {
    try {
      const queryParams = buyFreeSpinMode
        ? `?buyFreeSpinMode=${buyFreeSpinMode}`
        : "";
      const response = await fetch(
        `${ROUND_SIMULATION_API}${ENDPOINT.FREE_SPIN_ROUND_INFO}/${roundInfoId}${queryParams}`,
        {
          method: "GET",
        },
      );
      return await response.json();
    } catch (error) {
      console.error("Error getting free spin rounds:", error);
      throw error;
    }
  },

  async setResult(roundInfo: {
    name: string;
    result: RoundInfo | FreeSpinGroup;
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
