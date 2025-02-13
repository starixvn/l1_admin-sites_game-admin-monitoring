import React from "react";
import styles from "./dice.module.scss";
import DiceModel from "../../common/model/DiceModel";
import DiceType from "../../common/model/DiceType";
import configs from "../../../configs.json";

type DiceProps = {
  diceModel: DiceModel;
  isSmall: boolean;
  id?: string;
  onClickHandle?: Function;
  isColorGame?: boolean;
};

export default function Dice(props: DiceProps) {
  const { diceModel, isSmall, onClickHandle, id, isColorGame } = props;
  const { value, type } = diceModel;

  const getUnknowDiceImageRoot = (type) => {
    return isColorGame ? `/${DiceType[type].toLocaleLowerCase()}` : "";
  };

  const getDiceIconURL = (value, type) => {
    const rootPath = configs.RootUrl;
    let rootURL = `${rootPath}/game-admin/images/dice/${DiceType[
      type
    ].toLocaleLowerCase()}/dice-{0}.png`;

    const unknowDiceURL = `${rootPath}/game-admin/images/dice${getUnknowDiceImageRoot(
      type
    )}/dice-unknow.png`;

    if (value == undefined || type == undefined || value == -1) {
      return unknowDiceURL;
    }

    switch (type) {
      case DiceType.BauCua:
        const BauCuaDice = ["nai", "bau", "ga", "ca", "cua", "tom"];
        return rootURL.replace("{0}", BauCuaDice[value]);
      case DiceType.XocXoc:
        return rootURL.replace("{0}", value == true ? "red" : "white");
      case DiceType.TaiXiu:
        return rootURL.replace("{0}", value);
      case DiceType.ColorGame:
        const ColorGameDice = [
          "yellow",
          "red",
          "pink",
          "white",
          "blue",
          "green",
        ];
        return rootURL.replace("{0}", ColorGameDice[value]);
      case DiceType.KaraKrus:
        return rootURL.replace("{0}", value == true ? "kara" : "krus");
      default:
        return unknowDiceURL;
    }
  };

  const renderDice = () => {
    if (onClickHandle != undefined) {
      return (
        <div
          id={id}
          className={`${styles.dice} ${styles[DiceType[type]]} ${
            isSmall ? styles.small : ""
          } ${isColorGame ? styles["color-game"] : ""}`}
          onClick={() => onClickHandle(id, value)}
        >
          <img
            className={styles["dice-value"]}
            src={getDiceIconURL(value, type)}
          ></img>
        </div>
      );
    }

    return (
      <div
        id={id}
        className={`${styles.dice} ${styles[DiceType[type]]} ${
          isSmall ? styles.small : ""
        }  ${isColorGame ? styles["color-game"] : ""}`}
      >
        <img
          className={styles["dice-value"]}
          src={getDiceIconURL(value, type)}
        ></img>
      </div>
    );
  };

  return renderDice();
}
