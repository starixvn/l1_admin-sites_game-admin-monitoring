import React from "react";
import Card from "../../shared/card/card";
import styles from "../baccarat/styles.module.scss";
import blockChainStyles from "./blockchain-baccarat.module.scss";
import { BlockchainBaccaratCard } from "./blockchain-baccarat-result-updater";

export default function BlockchainBaccaratCardResult({ cards }) {
    return (
        <div className={styles['card-result']}>
            {Object.values(cards).map((result, index) => (
                result &&
                (<div key={index} className={`${blockChainStyles["holder"]} ${styles.card} ${index == 2 ? styles["third-card"] : ""}`}>
                    <Card value={(result as BlockchainBaccaratCard).rank} suit={(result as BlockchainBaccaratCard).suit} />
                    <div className={`${blockChainStyles["card-index"]}`}>{(result as BlockchainBaccaratCard).index}</div>
                </div>)
            ))
            }
        </div >
    );
}