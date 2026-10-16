
import { api } from "./client";

export type OrderItem = {
  nftId: string;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "confirmed";
  createdAt: string;
};

export type CreateOrderInput = {
  items: Array<{
    nftId: string;
    quantity: number;
  }>;
  token: string;
  idempotencyKey: string;
};

export async function createOrder({
  items,
  token,
  idempotencyKey,
}: CreateOrderInput): Promise<Order> {
  const response = await api.post<{ data: Order }>(
    "/orders",
    { items },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Idempotency-Key": idempotencyKey,
      },
    },
  );

  return response.data.data;
}
