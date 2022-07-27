import Cookies from "js-cookie";
import { NextRouter, withRouter } from "next/router";
import React from "react";
import { Modal, Row } from "reactstrap";

import {
  GameMonitoringInfo,
  getGameInfoByGameId,
  getGameInfoByGameName,
} from "../components/game-monitoring/game-monitoring";
import Loading from "../components/game-monitoring/game-template/game-template-loading";
import GameMenu from "../components/game-monitoring/menu/menu";
import SocketIO from "../components/util/game-server-endpoint/socket-io";
import GameWsEndpoint from "../components/util/game-server-endpoint/websocket";
import MessageTransmitter, {
  MessageTransmitterType,
} from "../components/util/message-transmitter";
import configs from "../configs.json";
import { gameMapper, getGameName } from "../constants/game-mapper-constant";

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
};

export class Home extends React.Component<Props, State> {
  public state: State;
  private messageTransmitter: MessageTransmitterType;
  private isProduction: boolean;
  private partners: Array<string>;
  protected readonly protocol: string;

  constructor(props: Props) {
    super(props);

    this.partners = configs.Partners;
    const env = configs.Env.toLocaleUpperCase();
    const token = env === "DEV"
      ? configs.DefaultToken
      : Cookies.get("token");

    this.protocol = "wss";
    this.isProduction = env === "PRO";
    this.messageTransmitter = MessageTransmitter();

    this.state = {
      gameId: 0,
      showLoading: true,
      gameName: "",
      token,
      showDisconnectedNotice: false,
      socket: null,
    };
  }

  initSocket(gameId: number) {
    const subPath = configs.SubPath === "" ? "" : `/${configs.SubPath}`;

    const socket = new SocketIO(
      `${this.protocol}://${configs.Domain}/${gameMapper[gameId].socket}`,
      `${subPath}/${gameMapper[gameId].socketRoute}`,
      configs.EnableMsgpack
    );

    socket.onDisconnected(this.showWebSocketDisconnected.bind(this));
    socket.addOrReplaceObserver(
      "sessionTimeout",
      this.showWebSocketDisconnected.bind(this),
      (message: { unauth: Object }) => message && message.unauth != null
    );

    return socket;
  }

      case gameNameMapper.unbalancedbigsmall1:
        return {
          endpoint:
            process.env.NEXT_PUBLIC_ENV === "local"
              ? process.env.NEXT_PUBLIC_UNBALANCED_BIGSMALL1_SERVER_ENDPOINT
              : Cookies.get("unbalanced-bigsmall1-server-endpoint"),
          route:
            process.env.NEXT_PUBLIC_ENV === "local"
              ? process.env.NEXT_PUBLIC_UNBALANCED_BIGSMALL1_SERVER_PROXY_ROUTE
              : Cookies.get("unbalanced-bigsmall1-server-endpoint-route"),
        };
      case gameNameMapper.unbalancedbigsmall2:
        return {
          endpoint:
            process.env.NEXT_PUBLIC_ENV === "local"
              ? process.env.NEXT_PUBLIC_UNBALANCED_BIGSMALL2_SERVER_ENDPOINT
              : Cookies.get("unbalanced-bigsmall2-server-endpoint"),
          route:
            process.env.NEXT_PUBLIC_ENV === "local"
              ? process.env.NEXT_PUBLIC_UNBALANCED_BIGSMALL2_SERVER_PROXY_ROUTE
              : Cookies.get("unbalanced-bigsmall2-server-endpoint-route"),
        };
      case gameNameMapper.unbalancedbigsmall3:
        return {
          endpoint:
            process.env.NEXT_PUBLIC_ENV === "local"
              ? process.env.NEXT_PUBLIC_UNBALANCED_BIGSMALL3_SERVER_ENDPOINT
              : Cookies.get("unbalanced-bigsmall3-server-endpoint"),
          route:
            process.env.NEXT_PUBLIC_ENV === "local"
              ? process.env.NEXT_PUBLIC_UNBALANCED_BIGSMALL3_SERVER_PROXY_ROUTE
              : Cookies.get("unbalanced-bigsmall3-server-endpoint-route"),
        };
      case gameNameMapper.unbalancedbigsmall4:
        return {
          endpoint:
            process.env.NEXT_PUBLIC_ENV === "local"
              ? process.env.NEXT_PUBLIC_UNBALANCED_BIGSMALL4_SERVER_ENDPOINT
              : Cookies.get("unbalanced-bigsmall4-server-endpoint"),
          route:
            process.env.NEXT_PUBLIC_ENV === "local"
              ? process.env.NEXT_PUBLIC_UNBALANCED_BIGSMALL4_SERVER_PROXY_ROUTE
              : Cookies.get("unbalanced-bigsmall4-server-endpoint-route"),
        };


  async componentDidUpdate(prevProps) {
    const { query } = this.props.router;

    if (query !== prevProps.router.query) {
      const gameId = (query.gameid || 0).toString();
      const gameName = (query.game || "").toString();

      const socket = this.initSocket(
        parseInt(gameId) > 0
          ? parseInt(gameId)
          : parseInt(getGameName(gameName))
      );

      await socket.connect();

      this.changeLoadingState(false);
      this.setState({ gameId, gameName, socket });
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
