import BetItem, {
  PartnersSC1,
  PartnersVG2,
  SystemSC1Id,
  SystemVG2Id,
} from "../common/model/BetItem";

export function upperFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export const updateTotalBetOfBetList = (
  betList: object,
  systemFilter?: SystemSC1Id,
  partnerFilter?: string,
  excludeUSS?: boolean
) => {
  if (systemFilter) {
    Object.keys(betList).forEach(
      (choice) =>
        (betList[choice].total = getTotalBetOnSystem(
          betList[choice].dataList,
          systemFilter,
          partnerFilter,
          excludeUSS
        ))
    );
  }
};

export const getTotalBetOnSystem = (
  betList: Array<BetItem>,
  systemFilter: SystemSC1Id,
  partnerFilter: string,
  excludeUSS?: boolean
) => {
  return betList.reduce(
    (total, betInfo) =>
      (!betInfo.system || betInfo.system == systemFilter) &&
      (!betInfo.partnerId || betInfo.partnerId == partnerFilter) &&
      (!excludeUSS || betInfo.currency.toLocaleUpperCase() != "UUS")
        ? total + betInfo.bet
        : total,
    0
  );
};

export const getBetAmountOnSystem = (
  systemType: string,
  amount: number,
  baseMultiplier: number
) => {
  const multiplier = 1;
  return parseFloat((amount / multiplier).toFixed(2));
};

export const getAppTypeOnSystem = (systemType: string, appType: number) => {
  if (systemType === "SC1") {
    return SystemSC1Id[appType];
  } else {
    return SystemVG2Id[appType];
  }
};

export const getPartnerOnSystem = (systemType: string, partnerId: string) => {
  if (!partnerId) {
    return "";
  }
  if (systemType === "SC1") {
    return PartnersSC1[partnerId];
  } else {
    return PartnersVG2[partnerId];
  }
};
