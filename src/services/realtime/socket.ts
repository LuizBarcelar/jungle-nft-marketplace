
import { io } from "socket.io-client";

export type NftPriceUpdate = {
  nftId: string;
  changePercent: number;
  timestamp: string;
};

export const socket = io(
  import.meta.env.VITE_SOCKET_URL ??
    "http://localhost:3001",
  {
    autoConnect: false,
    reconnection: true,
  },
);
