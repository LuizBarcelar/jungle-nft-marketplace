import { io } from "socket.io-client";

export type NftPriceUpdate = {
  nftId: string;
  changePercent: number;
  timestamp: string;
};

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  "https://kurio-realtime.onrender.com";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  timeout: 20000,
});