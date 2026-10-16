
import { setupWorker } from "msw/browser";

import { nftHandlers } from "./handlers/nfts";
import { authHandlers } from "./handlers/auth";
import { orderHandlers } from "./handlers/orders";

export const worker = setupWorker(
  ...nftHandlers,
  ...authHandlers,
  ...orderHandlers,
);
