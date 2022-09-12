export enum SystemSC1Id {
  All,
  SC,
  SM,
  SI,
  MK,
}
export enum SystemVG2Id {
  All,
  VG,
  VGM,
  VGI,
  VGK,
}

export const PartnersSC1 = {
  ONEworks1: "1W",
  SBO: "SPart",
};

export const PartnersVG2 = {
  ONEworksVGCash: "VG",
  ONEworksVG2: "VG2",
  SBO: "SBO_VG2",
};

export default class BetItem {
  name: string;
  bet: number;
  time: string;
  choice: string;
  system: SystemSC1Id;
  currency: string;
  partnerId: string;

  constructor(
    name: string = "",
    bet: number = 0,
    time: string = "",
    choice = "",
    system = SystemSC1Id.All,
    currency = "",
    partnerId = ""
  ) {
    this.name = name;
    this.bet = bet;
    this.time = time;
    this.choice = choice;
    this.system = system;
    this.currency = currency;
    this.partnerId = partnerId;
  }
}
