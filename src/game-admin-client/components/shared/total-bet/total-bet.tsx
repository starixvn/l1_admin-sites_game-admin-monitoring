import React from "react";
import style from "./total-bet.module.scss";
const gameStyles = {
  tiger: {
    className: "tigerBg",
    inline: {
      backgroundUrl: 'url("../../../game-admin/images/dragon-tiger/tiger.png") no-repeat',
      backgroundSize: "contain"
    }
  },
  dragon: {
    className: "dragonBg",
    inline: {
      backgroundUrl: 'url("../../../game-admin/images/dragon-tiger/tiger.png") no-repeat',
      backgroundSize: "contain"
    }
  },
  draw: {
    className: "drawBg",
    inline: {}
  },
  big: {
    className: "bigBg",
    inline: {}
  },
  small:{
    className: "smallBg",
    inline: {}
  },
  tai: {
    className: "bigBg",
    inline: {}
  },
  xiu: {
    className: "smallBg",
    inline: {}
  },
  tom: {
    className: "tomBg",
    inline: {}
  },
  cua: {
    className: "cuaBg",
    inline: {}
  },
  bau: {
    className: "bauBg",
    inline: {}
  },
  ca:{
    className: "caBg",
    inline: {}
  },
  nai: {
    className: "naiBg",
    inline: {}
  },
  ga: {
    className: "gaBg",
    inline: {}
  },
  motdobatrang: {
    className: "motdobatrangBg",
    inline: {}
  },
  mottrangbado: {
    className: "mottrangbadoBg",
    inline: {}
  },
  bondo: {
    className: "bondoBg",
    inline: {}
  },
  bontrang: {
    className: "bontrangBg",
    inline: {}
  },
  haido: {
    className: "haidoBg",
    inline: {}
  },
  plateeven: {
    className: "plateevenBg",
    inline: {}
  },
  plateodd: {
    className: "plateoddBg",
    inline: {}
  },
  chan: {
    className: "chanBg",
    inline: {}
  },
  le: {
    className: "leBg",
    inline: {}
  },
  kenogold: {
    className: "kenogoldBg",
    inline: {}
  },
  kenowood: {
    className: "kenowoodBg",
    inline: {}
  },
  kenowater: {
    className: "kenowaterBg",
    inline: {}
  },
  kenofire: {
    className: "kenofireBg",
    inline: {}
  },
  kenoearth: {
    className: "kenoearthBg",
    inline: {}
  },
  kenobig: {
    className: "kenobigBg",
    inline: {}
  },
  kenosmall: {
    className: "kenosmallBg",
    inline: {}
  },
  kenoeven: {
    className: "kenoevenBg",
    inline: {}
  },
  kenoodd: {
    className: "kenooddBg",
    inline: {}
  },
  player: {
    className: "playerBg",
    inline: {}
  },
  banker: {
    className: "bankerBg",
    inline: {}
  },
  tie: {
    className: "tieBg",
    inline: {}
  },
  baccaratBig: {
    className: "baccaratBigBg",
    inline: {}
  },
  baccaratSmall: {
    className: "baccaratSmallBg",
    inline: {}
  },
  playerPair: {
    className: "playerPairBg",
    inline: {}
  },
  bankerPair: {
    className: "bankerPairBg",
    inline: {}
  },
  anyTriple: {
    className: "anyTripleBg",
    inline: {}
  },
  mountain: {
    className: "mountainBg",
    inline: {}
  },
  ocean: {
    className: "oceanBg",
    inline: {}
  },
  specificNumber: {
    className: "specificNumberBg",
    inline: {}
  },
  totalPoints: {
    className: "totalPointsBg",
    inline: {}
  },
  sicboBig: {
    className: "sicboBigBg",
    inline: {}
  },
  sicboSmallBg: {
    className: "sicboSmallBg",
    inline: {}
  },
  odd: {
    className: "oddBg",
    inline: {}
  },
  even: {
    className: "evenBg",
    inline: {}
  },
  playerOdd: {
    className: "playerOddBg",
    inline: {}
  },
  playerEven: {
    className: "playerEvenBg",
    inline: {}
  },
  bankerOdd: {
    className: "bankerOddBg",
    inline: {}
  },
  bankerEven: {
    className: "bankerEvenBg",
    inline: {}
  },
  playerRed4: {
    className: "playerRed4Bg",
    inline: {}
  },
  playerRed3: {
    className: "playerRed3Bg",
    inline: {}
  },
  playerWhite3: {
    className: "playerWhite3Bg",
    inline: {}
  },
  playerWhite4: {
    className: "playerWhite4Bg",
    inline: {}
  },
  bankerRed4: {
    className: "bankerRed4Bg",
    inline: {}
  },
  bankerRed3: {
    className: "bankerRed3Bg",
    inline: {}
  },
  bankerWhite3: {
    className: "bankerWhite3Bg",
    inline: {}
  },
  bankerWhite4: {
    className: "bankerWhite4Bg",
    inline: {}
  },
};


export default function TotalBet(props: {
  type: string;
  total: number;
  isWin?: boolean;
}) {
  const { type, total, isWin } = props;
  const gameStyle = gameStyles[type] ? gameStyles[type] : `{className: ${type}Bg, inline: {}}`;

  const amount = total.toLocaleString("en-US");
  return (
    <div
      className={`${style.wrapper} ${style[gameStyle.className]} ${
        isWin ? style.win : ""
      }`}
    >
      {/* <img  className={`${style.wrapper} ${style[className]} ${
        isWin ? style.win : ""
      }`} src='../../../game-admin/images/dragon-tiger/dragon.png' />  */}
      <div className={`${style.bg} `} style={gameStyle["inline"]}>
        <div className={`${style.outerBg}`}></div>
        <div className={`${style.innerBg}`}></div>
      </div>
      <div className={`${style.totalText}`}>{amount}</div>
    </div>
  );
}
