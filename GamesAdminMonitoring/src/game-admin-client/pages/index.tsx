import Cookies from "js-cookie";
import { NextRouter, withRouter } from "next/router";
import React from "react";
import { Modal, Row } from "reactstrap";

import {
  GameMonitoringInfo,
  getGameInfoByGameId,
  getGameInfoByGameName,
} from "../components/game-monitoring/game-monitoring";
import gameNameMapper from "../components/game-monitoring/game-name-mapper";
import Loading from "../components/game-monitoring/game-template/game-template-loading";
import GameMenu from "../components/game-monitoring/menu/menu";
import SocketIO from "../components/util/game-server-endpoint/socket-io";
import GameWsEndpoint from "../components/util/game-server-endpoint/websocket";
import MessageTransmitter, {
  MessageTransmitterType,
} from "../components/util/message-transmitter";
import config from "../configs.json";

type Props = {
  router: NextRouter;
};

type State = {
  gameId: string | number;
  showLoading: boolean;
  gameName: string;
  token: string;
  showDisconnectedNotice: boolean;
  socket: GameWsEndpoint;
  env: string;
};

const NewSocketGameIds = [
  1, 2, 3, 4, 6, 7, 8, 9, 10, 21, 22, 24, 25, 26, 27, 28, 31, 35, 12, 13, 14,
  15, 16, 17, 18, 19, 36, 37, 40, 41, 43,
];

const environmentPartners = {
  LOCAL: ["ONEworks1", "SBO"],
  "LOCAL-1": ["ONEworks1", "SBO"],
  LOCAL_2: ["ONEworks1", "SBO"],
  SIT: ["ONEworks1", "SBO"],
  UAT: ["ONEworks1"],
  PRO: ["ONEworks1"],
};

export class Home extends React.Component<Props, State> {
  public state: State;
  private messageTransmitter: MessageTransmitterType;
  private isProduction: boolean;
  private partners: Array<string>;
  protected readonly protocol: string;

  constructor(props: Props) {
    super(props);

    this.partners = environmentPartners[this.state.env.toUpperCase()]
    const token =
      process.env.NEXT_PUBLIC_ENV === "local"
        ? process.env.NEXT_PUBLIC_TOKEN
        : Cookies.get("token");
    this.protocol = "wss";
    this.isProduction =
      Cookies.get("env") && Cookies.get("env").toLocaleUpperCase() === "PRO";
    this.messageTransmitter = MessageTransmitter();

    this.state = {
      gameId: 0,
      showLoading: true,
      gameName: "",
      token,
      showDisconnectedNotice: false,
      socket: null,
      env: "LOCAL"
    };
  }

  initSocket(gameId: number) {
    const socketInfo = config.GameServers[`${gameId}`] ?? config.GameServers["0"];
    const socket = NewSocketGameIds.includes(gameId)
      ? new SocketIO(
          `${this.protocol}://${socketInfo.Endpoint}`,
          socketInfo.Route
        )
      : new GameWsEndpoint(`${this.protocol}://${socketInfo.Endpoint}/admin`);

    socket.onDisconnected(this.showWebSocketDisconnected.bind(this));
    socket.addOrReplaceObserver(
      "sessionTimeout",
      this.showWebSocketDisconnected.bind(this),
      (message: { unauth: Object }) => message && message.unauth != null
    );

    return socket;
  }

  async componentDidUpdate(prevProps) {
    const { query } = this.props.router;

    if (query !== prevProps.router.query) {
      const gameId = (query.gameId || 0).toString();
      const gameName = (query.game || "").toString();
      const token = (query.token || "").toString();
      const env = (query.env || "").toString();
      const socket = this.initSocket(
        parseInt(gameId) > 0
          ? parseInt(gameId)
          : parseInt(gameNameMapper[gameName])
      );

      await socket.connect();

      this.changeLoadingState(false);
      this.setState({ gameId, gameName, socket, token, env });
    }
  }

  changeLoadingState(showLoading: boolean) {
    this.setState({ showLoading });
  }

  renderGameMonitoringComponent(info: GameMonitoringInfo) {
    const { gameId, socket } = this.state;
    const { onMessage, selector, initialMessage, endMessage, generateMessage } =
      info;
    const key = `game-monitoring:${gameId}`;
    const onStopReceiveMessage = () => {
      socket.send(endMessage);
      this.messageTransmitter.clearAllListener();
    };
    const sendMessage = (data: any) => {
      const message = generateMessage(data);

      socket.send(message);
    };

    socket.send(initialMessage);
    socket.addOrReplaceObserver(
      key,
      onMessage(this.messageTransmitter.broadcast),
      selector
    );

    return (
      <>
        <info.component
          sendMessage={sendMessage}
          onMessage={this.messageTransmitter.addListener}
          onStopReceiveMessage={onStopReceiveMessage}
          isProduction={this.isProduction}
          partners={this.partners}
        />
        <Modal isOpen={this.state.showDisconnectedNotice} className="notice">
          <Row>Network is disconnected or session timeout.</Row>
          <Row>
            Please close this popup and open new popup to monitor again.
          </Row>
        </Modal>
      </>
    );
  }

  showWebSocketDisconnected() {
    this.setState({ showDisconnectedNotice: true });
  }

  renderLoaderOrGameMenu() {
    const { showLoading } = this.state;
    return showLoading ? <Loading /> : <GameMenu />;
  }

  render() {
    const { gameId, gameName, token, socket } = this.state;

    const info = getGameInfoByGameId(gameId) || getGameInfoByGameName(gameName);

    socket && socket.login({ jwt: token });

    return info
      ? this.renderGameMonitoringComponent(info)
      : this.renderLoaderOrGameMenu();
  }
}

export default withRouter(Home);
