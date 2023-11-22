import { HankModel } from "./bandar-qiu-qiu-model";

export const Dominoes = [
  "00", "01", "02", "03", "04", "05", "06",
  "11", "12", "13", "14", "15", "16",
  "22", "23", "24", "25", "26",
  "33", "34", "35", "36",
  "44", "45", "46",
  "55", "56",
  "66"
]

export const BandarQiuQiuResources = {
  unauthorized: "You are not authorized to set result",
  gameName: "Bandar Qiu Qiu",
  nextRound: "Next Round:",
  submit: "Submit",
  fillOutResult: "Fill Out Result",
  setDefaultResult: "Set Default Result",
  disabledMessage: "Game is disabled.",
  updateSuccessful: "Success! Your result has been set."
}

export const BandarQiuQiuConstant = {
  totalTimeInRound: 39,
  waitingTime: 13,
  showedSucceedMessegeTimebyMillisecond: 2000
}

export const defaultResult = [
  new HankModel("Banker", ["00", "01", "02", "03"]),
  new HankModel("Spade", ["11", "12", "13", "14"]),
  new HankModel("Heart", ["22", "23", "24", "25"]),
  new HankModel("Club", ["33", "34", "35", "36"]),
  new HankModel("Diamond", ["44", "45", "46", "55"]),
];