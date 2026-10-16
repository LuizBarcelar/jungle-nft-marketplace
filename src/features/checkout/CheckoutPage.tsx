
import { useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  ArrowLeft,
  CheckCircle2,
  LockKeyhole,
  ShoppingBag,
} from "lucide-react";

import { nfts } from "@/features/catalog/data";
import { clearCart, useCart } from "@/features/cart/store";
import { getCurrentUser } from "@/services/api/auth";
import {
  createOrder,
  type Order,
} from "@/services/api/orders";

const networkFee = 0.016;

export function CheckoutPage() {
  const cart = useCart();
  const navigate = useNavigate();

  const [confirmedOrder, setConfirmedOrder] =
    useState<Order | null>(null);

  const idempotencyKey = useRef<string | null>(null);

  const items = nfts.filter((nft) => cart[nft.id] > 0);

  const subtotal = items.reduce(
    (sum, nft) => sum + nft.price * cart[nft.id],
    0,
  );

  const total = subtotal + (items.length ? networkFee : 0);

  const token = sessionStorage.getItem("kurio-token");

  const mutation = useMutation({
    mutationFn: async () => {
      const currentToken = sessionStorage.getItem("kurio-token");

      if (!currentToken) {
        throw new Error("Faça login para continuar.");
      }

      // Confirma que a sessão ainda é válida.
      await getCurrentUser(currentToken);

      if (!idempotencyKey.current) {
        idempotencyKey.current = crypto.randomUUID();
      }

      return createOrder({
        token: currentToken,
        idempotencyKey: idempotencyKey.current,
        items: items.map((nft) => ({
          nftId: nft.id,
          quantity: cart[nft.id],
        })),
      });
    },

    onSuccess: (order) => {
      setConfirmedOrder(order);
      clearCart();
    },
  });

  const errorMessage =
    mutation.error instanceof AxiosError
      ? mutation.error.response?.data?.message ??
        "Não foi possível concluir o pedido."
      : mutation.error instanceof Error
        ? mutation.error.message
        : "Não foi possível concluir o pedido.";

  if (confirmedOrder) {
    return (
      <main className="simple-page">
        <div className="mx-auto max-w-xl py-12 text-center">
          <CheckCircle2
            size={64}
            className="mx-auto mb-6 text-green-400"
          />

          <h1 className="mb-4 text-3xl font-bold">
            Pedido confirmado!
          </h1>

          <p className="mb-6 text-gray-400">
            Sua compra foi registrada com sucesso no
            ambiente de demonstração da Kurio.
          </p>

          <div className="mb-8 rounded-xl border border-gray-700 p-6 text-left">
            <p className="mb-3">
              <strong>Pedido:</strong>{" "}
              <span className="break-all">
                {confirmedOrder.id}
              </span>
            </p>

            <p className="mb-3">
              <strong>Status:</strong> Confirmado
            </p>

            <p className="mb-3">
              <strong>NFTs:</strong>{" "}
              {confirmedOrder.items.reduce(
                (sum, item) => sum + item.quantity,
                0,
              )}
            </p>

            <p>
              <strong>Total:</strong>{" "}
              {confirmedOrder.total.toFixed(3)} ETH
            </p>
          </div>

          <Link to="/" className="kurio-button">
            CONTINUAR EXPLORANDO
          </Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="simple-page">
        <div className="py-12 text-center">
          <ShoppingBag
            size={48}
            className="mx-auto mb-5"
          />

          <h1 className="mb-4 text-3xl font-bold">
            Seu carrinho está vazio
          </h1>

          <p className="mb-8 text-gray-400">
            Adicione NFTs para continuar com a compra.
          </p>

          <Link to="/" className="kurio-button">
            EXPLORAR NFTs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-heading">
        <Link to="/cart" aria-label="Voltar ao carrinho">
          <ArrowLeft size={20} />
        </Link>

        <h1>Finalizar compra</h1>
      </div>

      <div className="cart-layout">
        <section className="cart-items">
          <h2 className="mb-6 text-xl font-semibold">
            Revisar pedido
          </h2>

          {items.map((nft) => (
            <div className="cart-item" key={nft.id}>
              <img src={nft.image} alt={nft.name} />

              <div className="cart-item-info">
                <strong>{nft.name}</strong>
                <small>Rede: {nft.network}</small>
                <small>
                  Quantidade: {cart[nft.id]}
                </small>
              </div>

              <strong>
                {(nft.price * cart[nft.id]).toFixed(2)} ETH
              </strong>
            </div>
          ))}

          <div className="mt-8 rounded-xl border border-gray-700 p-5">
            <div className="mb-3 flex items-center gap-3">
              <LockKeyhole size={22} />
              <h3 className="font-semibold">
                Pagamento demonstrativo
              </h3>
            </div>

            <p className="text-sm text-gray-400">
              Esta é uma simulação de compra de NFTs.
              Nenhuma carteira real será conectada e
              nenhuma criptomoeda será transferida.
            </p>
          </div>
        </section>

        <aside className="cart-summary">
          <h3>Resumo do pedido</h3>

          <div>
            <span>Subtotal</span>
            <span>{subtotal.toFixed(3)} ETH</span>
          </div>

          <div>
            <span>Taxa de rede simulada</span>
            <span>{networkFee.toFixed(3)} ETH</span>
          </div>

          <div className="summary-total">
            <b>Total</b>
            <strong>{total.toFixed(3)} ETH</strong>
          </div>

          {!token && (
            <p className="mb-4 text-sm text-orange-400">
              Faça login para finalizar sua compra.
            </p>
          )}

          {mutation.isError && (
            <p
              role="alert"
              className="mb-4 text-sm text-red-400"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="button"
            className="kurio-button checkout-button"
            disabled={mutation.isPending}
            onClick={() => {
              if (!token) {
                void navigate({
                  to: "/login",
                  search: { redirect: "/checkout" },
                });
                return;
              }

              mutation.mutate();
            }}
          >
            {mutation.isPending
              ? "PROCESSANDO PEDIDO..."
              : token
                ? "CONFIRMAR COMPRA"
                : "ENTRAR PARA CONTINUAR"}
          </button>

          <Link className="continue-link" to="/cart">
            Voltar ao carrinho
          </Link>
        </aside>
      </div>
    </main>
  );
}
