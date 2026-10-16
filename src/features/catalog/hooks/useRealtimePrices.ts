
import { useEffect, useState } from "react";
import {
  socket,
  type NftPriceUpdate,
} from "@/services/realtime/socket";

export function useRealtimePrices() {
  const [connected, setConnected] = useState(
    socket.connected,
  );

  const [updates, setUpdates] = useState<
    Record<string, NftPriceUpdate>
  >({});

  useEffect(() => {
    function onConnect() {
      setConnected(true);
    }

    function onDisconnect() {
      setConnected(false);
    }

    function onPriceUpdate(update: NftPriceUpdate) {
      setUpdates((previous) => ({
        ...previous,
        [update.nftId]: update,
      }));
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("nft:price-update", onPriceUpdate);

    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("nft:price-update", onPriceUpdate);

      socket.disconnect();
    };
  }, []);

  return { connected, updates };
}
