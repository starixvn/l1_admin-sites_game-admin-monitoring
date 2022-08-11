import _ from "lodash";

import Baccarat from "../components/game-monitoring/baccarat";
import BigSmallTurbo from "../components/game-monitoring/big-small-turbo/big-small-turbo";
import BigSmall from "../components/game-monitoring/big-small/big-small";
import DragonTiger from "../components/game-monitoring/dragon-tiger/dragon-tiger";
import FishPrawnCrab from "../components/game-monitoring/fish-prawn-crab/fish-prawn-crab";
import KenoProMax from "../components/game-monitoring/keno-pro-max/keno-pro-max";
import MiniKeno from "../components/game-monitoring/mini-keno";
import MiniSedie from "../components/game-monitoring/mini-sedie";
import OddEvenTurbo from "../components/game-monitoring/odd-even-turbo/odd-even-turbo";
import Roulette from "../components/game-monitoring/roulette";
import ShakeThePlate from "../components/game-monitoring/shake-the-plate/shake-the-plate";
import SpecialSeDie from "../components/game-monitoring/special-sedie";
import VipBaccarat from "../components/game-monitoring/vip-baccarat";
import VipFishPrawnCrab from "../components/game-monitoring/vip-fish-prawn-crab/vip-fish-prawn-crab";
import VipSeDie from "../components/game-monitoring/vip-sedie/vip-sedie";
import VipSeDieWar from "../components/game-monitoring/vip-se-die-war";
import SicBo from "../components/game-monitoring/sic-bo";
import Lottery from "../components/game-monitoring/lottery";
import ThreeCards from "../components/game-monitoring/three-cards";
import BitcoinMaster from "../components/game-monitoring/bitcoin-master";
import {
  KenoMatch1,
  KenoMatch2,
} from "../components/game-monitoring/keno-match";
import {
  KenoPower1,
  KenoPower2,
} from "../components/game-monitoring/keno-power";
import BlockchainBaccarat from "../components/game-monitoring/blockchain-baccarat";

const getObjectOfGame =
  (path: string) => (onMessage: Function) => (message: any) => {
    const object = _.get(message, path);
    onMessage && onMessage(object);
  };

const getInfoByGameKey = (key: string) => {
  const info = {
    selector: (message) => message[key] != null,
    onMessage: getObjectOfGame(key),
    initialMessage: {},
    endMessage: {},
    generateMessage: (data: any) => {
      const message = {};
      message[key] = data;

      return message;
    },
  };

  info.initialMessage[key] = {
    get_time: true,
    view: true,
    get_new: true,
    sync: true,
  };
  info.endMessage[key] = { view: false };

  return info;
};

export const gameMapper = {
  1: {
    name: "taixiu",
    component: BigSmall("Big Small"),
    socket: "admin/bigsmall",
    socketRoute: "bigsmall/socket.io",
    ...getInfoByGameKey("BigSmall"),
  },
  2: {
    name: "xocxoc",
    component: ShakeThePlate,
    socket: "admin/sedie",
    socketRoute: "sedie/socket.io",
    ...getInfoByGameKey("SeDie"),
  },
  3: {
    name: "baucua",
    component: FishPrawnCrab,
    socket: "admin/fishprawncrab",
    socketRoute: "fishprawncrab/socket.io",
    ...getInfoByGameKey("FishPrawnCrab"),
  },
  4: {
    name: "txturbo",
    component: BigSmallTurbo("Turbo Big Small", {
      placingBet: 30,
      waitingTime: 5,
    }),
    socket: "admin/txturbo",
    socketRoute: "turbobigsmall/socket.io",
    ...getInfoByGameKey("TXTurbo"),
  },
  6: {
    name: "oeturbo",
    component: OddEvenTurbo("Turbo Odd Even"),
    socket: "admin/oeturbo",
    socketRoute: "turbooddeven/socket.io",
    ...getInfoByGameKey("OETurbo"),
  },
  7: {
    name: "dragontiger",
    component: DragonTiger,
    socket: "admin/dragontiger",
    socketRoute: "dragontiger/socket.io",
    ...getInfoByGameKey("DragonTiger"),
  },
  8: {
    name: "kenopromax",
    component: KenoProMax,
    socket: "admin/kenopromax",
    socketRoute: "kenopromax/socket.io",
    ...getInfoByGameKey("KenoProMax"),
  },
  9: {
    name: "minisedie",
    component: MiniSedie,
    socket: "admin/minisedie",
    socketRoute: "minisedie/socket.io",
    ...getInfoByGameKey("MiniSeDie"),
  },
  10: {
    name: "baccarat",
    component: Baccarat,
    socket: "admin/baccarat",
    socketRoute: "baccarat/socket.io",
    ...getInfoByGameKey("Baccarat"),
  },
  12: {
    name: "kenomax",
    component: MiniKeno("kenoMax", 20),
    socket: "admin/kenomax",
    socketRoute: "minikeno/socket.io",
    ...getInfoByGameKey("KenoMax"),
  },
  13: {
    name: "kenomax2",
    component: MiniKeno("kenoMax2", 20),
    socket: "admin/kenomax2",
    socketRoute: "minikeno/socket.io",
    ...getInfoByGameKey("KenoMax2"),
  },
  14: {
    name: "kenomini",
    component: MiniKeno("kenoMini", 10),
    socket: "admin/kenomini",
    socketRoute: "minikeno/socket.io",
    ...getInfoByGameKey("KenoMini"),
  },
  15: {
    name: "kenomini2",
    component: MiniKeno("kenoMini2", 10),
    socket: "admin/kenomini2",
    socketRoute: "minikeno/socket.io",
    ...getInfoByGameKey("KenoMini2"),
  },
  16: {
    name: "kenoeast",
    component: MiniKeno("kenoEast", 20),
    socket: "admin/kenoeast",
    socketRoute: "minikeno/socket.io",
    ...getInfoByGameKey("KenoEast"),
  },
  17: {
    name: "kenowest",
    component: MiniKeno("kenoWest", 20),
    socket: "admin/kenowest",
    socketRoute: "minikeno/socket.io",
    ...getInfoByGameKey("KenoWest"),
  },
  18: {
    name: "kenosouth",
    component: MiniKeno("kenoSouth", 20),
    socket: "admin/kenosouth",
    socketRoute: "minikeno/socket.io",
    ...getInfoByGameKey("KenoSouth"),
  },
  19: {
    name: "kenonorth",
    component: MiniKeno("kenoNorth", 20),
    socket: "admin/kenonorth",
    socketRoute: "minikeno/socket.io",
    ...getInfoByGameKey("KenoNorth"),
  },
  21: {
    name: "roulette",
    component: Roulette,
    socket: "admin/roulette",
    socketRoute: "roulette/socket.io",
    ...getInfoByGameKey("Roulette"),
  },
  22: {
    name: "vipsedie",
    component: VipSeDie,
    socket: "admin/vipsedie",
    socketRoute: "vsedie/socket.io",
    ...getInfoByGameKey("VipSeDie"),
  },
  24: {
    name: "specialsedie",
    component: SpecialSeDie,
    socket: "admin/specialsedie",
    socketRoute: "specialsedie/socket.io",
    ...getInfoByGameKey("SpecialSeDie"),
  },
  25: {
    name: "sicbo",
    component: SicBo,
    socket: "admin/sicbo",
    socketRoute: "sicbo/socket.io",
    ...getInfoByGameKey("SicBo"),
  },
  26: {
    name: "vipfishprawncrab",
    component: VipFishPrawnCrab,
    socket: "admin/vipfishprawncrab",
    socketRoute: "vipfishprawncrab/socket.io",
    ...getInfoByGameKey("VipFishPrawnCrab"),
  },
  27: {
    name: "vipbaccarat",
    component: VipBaccarat,
    socket: "admin/vipbaccarat",
    socketRoute: "vipbaccarat/socket.io",
    ...getInfoByGameKey("VipBaccarat"),
  },
  28: {
    name: "vipsediewar",
    component: VipSeDieWar,
    socket: "admin/vipsediewar",
    socketRoute: "vipsediewar/socket.io",
    ...getInfoByGameKey("VipSedieWar"),
  },
  31: {
    name: "lottery",
    component: Lottery,
    socket: "admin/lottery",
    socketRoute: "lottery/socket.io",
    ...getInfoByGameKey("Lottery"),
  },
  35: {
    name: "threecards",
    component: ThreeCards,
    socket: "admin/threecards",
    socketRoute: "threecards/socket.io",
    ...getInfoByGameKey("ThreeCards"),
  },
  36: {
    name: "kenomatch1",
    component: KenoMatch1,
    socket: "admin/kenomatch1",
    socketRoute: "kenomatch/socket.io",
    ...getInfoByGameKey("KenoMatch1"),
  },
  37: {
    name: "kenomatch2",
    component: KenoMatch2,
    socket: "admin/kenomatch2",
    socketRoute: "kenomatch/socket.io",
    ...getInfoByGameKey("KenoMatch2"),
  },
  40: {
    name: "kenopower1",
    component: KenoPower1,
    socket: "admin/kenopower1",
    socketRoute: "kenopower/socket.io",
    ...getInfoByGameKey("KenoPower1"),
  },
  41: {
    name: "kenopower2",
    component: KenoPower2,
    socket: "admin/kenopower2",
    socketRoute: "kenopower/socket.io",
    ...getInfoByGameKey("KenoPower2"),
  },
  43: {
    name: "bitcoinmaster",
    component: BitcoinMaster,
    socket: "admin/bitcoinmaster",
    socketRoute: "bitcoinmaster/socket.io",
    ...getInfoByGameKey("BitcoinMaster"),
  },
  48: {
    name: "blockchainbaccarat",
    component: BlockchainBaccarat,
    socket: "admin/blockchainbaccarat",
    socketRoute: "blockchainbaccarat/socket.io",
    ...getInfoByGameKey("BlockchainBaccarat"),
  },
  50: {
    name: "unbalancedbigsmall1",
    component: BigSmall("Las Vegas"),
    socket: "admin/unbalancedbigsmall1",
    socketRoute: "unbalancedbigsmall/socket.io",
    ...getInfoByGameKey("UnbalancedBigSmall1"),
  },
  51: {
    name: "unbalancedbigsmall2",
    socket: "admin/unbalancedbigsmall2",
    socketRoute: "unbalancedbigsmall/socket.io",
    component: BigSmallTurbo("Marina Bay", { placingBet: 30, waitingTime: 10 }),
    ...getInfoByGameKey("UnbalancedBigSmall2"),
  },
  52: {
    name: "megakeno",
    component: MiniKeno("megaKeno", 20),
    socket: "admin/megakeno",
    socketRoute: "minikeno/socket.io",
    ...getInfoByGameKey("MegaKeno"),
  },
  53: {
    name: "megakeno2",
    component: MiniKeno("megaKeno2", 20),
    socket: "admin/megakeno2",
    socketRoute: "minikeno/socket.io",
    ...getInfoByGameKey("MegaKeno2"),
  },
  54: {
    name: "unbalancedbigsmall3",
    socket: "admin/unbalancedbigsmall3",
    socketRoute: "unbalancedbigsmall/socket.io",
    component: BigSmall("Macau"),
    ...getInfoByGameKey("UnbalancedBigSmall3"),
  },
  55: {
    name: "unbalancedbigsmall4",
    socket: "admin/unbalancedbigsmall4",
    socketRoute: "unbalancedbigsmall/socket.io",
    component: BigSmallTurbo("Monte Carlo", {
      placingBet: 30,
      waitingTime: 10,
    }),
    ...getInfoByGameKey("UnbalancedBigSmall4"),
  },
};

export const getGameName = (gameName: string) =>
  Object.keys(gameMapper).find(
    (key) =>
      gameMapper[key].name.toLocaleLowerCase() === gameName.toLocaleLowerCase()
  );
