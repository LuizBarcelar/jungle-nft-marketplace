import { Link } from "@tanstack/react-router";
import { ArrowLeft, Trash2 } from "lucide-react";
import { nfts } from "@/features/catalog/data";
import { setQuantity, useCart } from "./store";
export function CartPage() {
  const cart = useCart();
  const items = nfts.filter((n) => cart[n.id] > 0);
  const subtotal = items.reduce((s, n) => s + n.price * cart[n.id], 0);
  const fee = items.length ? 0.016 : 0;
  const total = subtotal + fee;
  return (
    <main className="cart-page">
      <div className="cart-heading">
        <Link to="/" aria-label="Voltar">
          <ArrowLeft size={20} />
        </Link>
        <h1>Carrinho de NFTs</h1>
      </div>
      {items.length === 0 ? (
        <div className="empty-state">
          Seu carrinho está vazio.
          <p>
            <Link className="kurio-button" to="/">
              Explorar NFTs
            </Link>
          </p>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            <div className="cart-table-header">
              <span>NFTs</span>
              <span>Preço</span>
              <span>Edições</span>
              <span>Total</span>
            </div>
            {items.map((n) => (
              <div className="cart-item" key={n.id}>
                <img src={n.image} alt={n.name} />
                <div className="cart-item-info">
                  <Link to="/nft/$id" params={{ id: n.id }}>
                    <b>{n.name}</b>
                  </Link>
                  <small>Edição: {n.edition}</small>
                  <strong className="cart-mobile-price">
                    {(n.price * cart[n.id]).toFixed(2)} ETH
                  </strong>
                </div>
                <span className="cart-unit-price">
                  {n.price.toFixed(2)} ETH
                </span>
                <div className="cart-qty">
                  <button onClick={() => setQuantity(n.id, cart[n.id] - 1)}>
                    −
                  </button>
                  <span>{cart[n.id]}</span>
                  <button onClick={() => setQuantity(n.id, cart[n.id] + 1)}>
                    +
                  </button>
                </div>
                <strong className="cart-line-total">
                  {(n.price * cart[n.id]).toFixed(2)} ETH
                </strong>
                <button
                  className="cart-remove"
                  onClick={() => setQuantity(n.id, 0)}
                  aria-label={`Remover ${n.name}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          <aside className="cart-summary">
            <h3>Resumo da carteira</h3>
            <label>Código promocional</label>
            <div className="promo-input">
              <input placeholder="Digite o código promocional..." />
              <button
                className="kurio-button"
                onClick={() =>
                  alert("Nenhum cupom disponível nesta demonstração.")
                }
              >
                Aplicar
              </button>
            </div>
            <div>
              <span>Subtotal</span>
              <span>{subtotal.toFixed(2)} ETH</span>
            </div>
            <div>
              <span>Desconto do lançamento</span>
              <span>(-) 00.00</span>
            </div>
            <div>
              <span>Taxa de rede</span>
              <span>{fee.toFixed(3)} ETH</span>
            </div>
            <div className="summary-total">
              <b>Total</b>
              <strong>{total.toFixed(3)} ETH</strong>
            </div>
            <Link className="kurio-button checkout-button" to="/checkout">
              Conectar e finalizar
            </Link>
            <Link className="continue-link" to="/">
              Continuar explorando
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
