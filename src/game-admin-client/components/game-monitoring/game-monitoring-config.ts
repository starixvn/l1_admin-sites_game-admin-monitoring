import commonConstant from "../../constants/common-constant";

const loadOrderFromConfigString = (config: string) => {
  if (config) {
    return config.split(",");
  }

  return null;
};

export const types = {
  taixiu: "taixiu",
  chanle: "chanle",
  clturbo: "clturbo",
};

export const gameMapping = {
  taixiu: loadOrderFromConfigString(commonConstant.TaiXiuOrder) || [
    "tai",
    "xiu",
  ],
  chanle: loadOrderFromConfigString(commonConstant.ChanLeOrder) || [
    "chan",
    "le",
  ],
  clturbo: loadOrderFromConfigString(commonConstant.ChanLeOrder) || [
    "chan",
    "le",
  ],
};

export const gameFlagMapping = {
  taixiu: {
    0: "xiu",
    1: "tai",
  },
  chanle: {
    0: "le",
    1: "chan",
  },
  clturbo: {
    0: "le",
    1: "chan",
  },
};
