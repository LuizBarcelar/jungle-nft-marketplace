
import { http, HttpResponse } from "msw";
import { nfts } from "@/features/catalog/data";
import { getAuthenticatedUser } from "./auth";

type OrderItem = {
  nftId: string;
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "confirmed";
  createdAt: string;
};

const orders: Order[] = [];
const idempotencyKeys = new Map<string, Order>();

export const orderHandlers = [
  http.post("/api/orders", async ({ request }) => {
    const user = getAuthenticatedUser(request);

    if (!user) {
    return HttpResponse.json(
        { message: "Sessão inválida ou expirada. Faça login novamente." },
        { status: 401 },
    );
    }

    const idempotencyKey = request.headers.get(
      "Idempotency-Key",
    );

    if (!idempotencyKey) {
      return HttpResponse.json(
        { message: "Chave de idempotência obrigatória." },
        { status: 400 },
      );
    }

    const existingOrder = idempotencyKeys.get(
      `${user.id}:${idempotencyKey}`
    );

    if (existingOrder) {
      return HttpResponse.json(
        { data: existingOrder },
        { status: 200 },
      );
    }

    
const body = (await request.json()) as {
  items?: Array<{
    nftId: string;
    quantity: number;
  }>;
};

if (
  !Array.isArray(body.items) ||
  body.items.length === 0 ||
  body.items.some(
    (item) =>
      !item ||
      typeof item.nftId !== "string" ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 50,
  )
) {
  return HttpResponse.json(
    { message: "Carrinho inválido ou vazio." },
    { status: 400 },
  );
}

const ids = body.items.map((item) => item.nftId);

if (new Set(ids).size !== ids.length) {
  return HttpResponse.json(
    { message: "O carrinho contém itens duplicados." },
    { status: 400 },
  );
}

const orderItems: OrderItem[] = [];

for (const item of body.items) {
  const nft = nfts.find((n) => n.id === item.nftId);

  if (!nft) {
    return HttpResponse.json(
      { message: "Um ou mais NFTs não foram encontrados." },
      { status: 400 },
    );
  }

  orderItems.push({
    nftId: nft.id,
    name: nft.name,
    price: nft.price,
    quantity: item.quantity,
  });
}

const subtotal = orderItems.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0,
);

const networkFee = 0.016;
const total = subtotal + networkFee;

const order: Order = {
  id: crypto.randomUUID(),
  userId: user.id,
  items: orderItems,
  total: Number(total.toFixed(2)),
  status: "confirmed",
  createdAt: new Date().toISOString(),
};

  orders.push(order);
  idempotencyKeys.set(
    `${user.id}:${idempotencyKey}`,
    order,
  );

    return HttpResponse.json(
      { data: order },
      { status: 201 },
    );
  }),
];
