import React from "react";
import { Col, Row } from "reactstrap";
import NextBall1Game from "../nextball1/nextball1-game";
import styles from "./../nextball1/nextball.module.scss";
import { NextBall2Resources } from "./nextball2-constants";

export default class NextBall2Game extends NextBall1Game {
  renderGameName() {
    return (
      <Row>
        <Col className={`${styles["bold"]}`}>
          <h2>{NextBall2Resources.gameName}</h2>
        </Col>
      </Row>
    );
  }
}
