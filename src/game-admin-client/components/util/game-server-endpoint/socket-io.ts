import { io, Socket, ManagerOptions, SocketOptions } from "socket.io-client";
import logger from "../logger";
import Websocket from "./websocket";
import * as MsgpackParser from "socket.io-msgpack-parser";

export default class SocketIO extends Websocket {
  private socketIO: Socket;
  private enabledMsgpack: boolean;

  constructor(
    endpoint: string,
    route: string = "",
    enabledMsgpack: boolean = false
  ) {
    super(endpoint, route);
    this.enabledMsgpack = enabledMsgpack;
  }

  connect() {
    return new Promise<void>((resolve) => {
      if (!this.isConnected) {
        const socketOptions: Partial<ManagerOptions & SocketOptions> = {
          transports: ["websocket"],
          upgrade: false,
          path: this.endpointRoute,
        };
        if (this.enabledMsgpack) {
          socketOptions.parser = MsgpackParser;
        }
        this.socketIO = io(this.endpoint, socketOptions);

        this.socketIO.on("connect", () => {
          this.isConnected = true;
          this.socketIO.on("message", this.onReceiveMessage.bind(this));
          this.socketIO.on("error", (event) => logger.error(event));
          this.socketIO.on("disconnect", this.disconnect.bind(this));
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  send(message: Object) {
    try {
      if (this.socketIO && this.socketIO.connected) {
        this.socketIO.emit("message", message);
      }
    } catch (e) {
      logger.error(e);
    }
  }

  protected onReceiveMessage(event: MessageEvent) {
    try {
      this.executeObservers(event);
    } catch (e) {
      logger.error(e);
    }
  }

  disconnect() {
    const message = {
      [this.onDisconnectedMessage]: this.onDisconnectedMessage,
    };

    this.socketIO.close();
    this.executeObservers(message);
  }
}
