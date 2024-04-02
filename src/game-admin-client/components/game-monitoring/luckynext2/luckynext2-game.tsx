import React from "react";
import { Col, Row } from "reactstrap";
import LuckyNext1Game from "../luckynext1/luckynext1-game";
import styles from "./../luckynext1/luckynext.module.scss";
import { LuckyNext2Resources } from "./luckynext2-constants";

export default class LuckyNext2Game extends LuckyNext1Game {
  renderGameName() {
    return (
      <Row>
        <Col className={`${styles["bold"]}`}>
          <h2>{LuckyNext2Resources.gameName}</h2>
        </Col>
      </Row>
    );
  }
}

