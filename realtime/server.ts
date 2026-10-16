
import { Server } from "socket.io";
import { nfts } from "../src/features/catalog/data";

const PORT = Number(process.env.PORT || 3001);

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL,
].filter((origin): origin is string => Boolean(origin));

const io = new Server(PORT, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

console.log(`Kurio Socket.IO ativo na porta ${PORT}`);

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.emit("market:connected", {
    message: "Conectado ao mercado Kurio",
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

setInterval(() => {
  if (nfts.length === 0) return;

  const nft = nfts[Math.floor(Math.random() * nfts.length)];

  const changePercent = Number(
    (Math.random() * 10 - 5).toFixed(2),
  );

  io.emit("nft:price-update", {
    nftId: nft.id,
    changePercent,
    timestamp: new Date().toISOString(),
  });

  console.log(
    `NFT ${nft.id}: ${changePercent > 0 ? "+" : ""}${changePercent}%`,
  );
}, 15000);
