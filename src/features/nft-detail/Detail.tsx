import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Heart, ShoppingCart, Star } from "lucide-react";
import { nfts, formatEth } from "@/features/catalog/data";
import { addToCart, toggleFavorite, useFavorites } from "@/features/cart/store";
import { NftCard } from "@/components/shared/NftCard";
export function Detail() {
  const { id } = useParams({ from: "/nft/$id" });
  const nft = nfts.find((n) => n.id === id);
  const [qty, setQty] = useState(1);
  const favorites = useFavorites();
  if (!nft)
    return (
      <div className="empty-state">
        NFT não encontrado. <Link to="/">Voltar ao catálogo</Link>
      </div>
    );
  const liked = favorites.includes(nft.id);
  return (
    <main className="detail-page">
      <div className="detail-back">
        <Link to="/">
          <ArrowLeft size={18} /> Voltar ao mercado
        </Link>
      </div>
      <div className="detail-layout">
        <div className="detail-image">
          <img src={nft.image} alt={nft.name} />
        </div>
        <div className="detail-info">
          <div className="detail-title">
            <h1>{nft.name}</h1>
            <span>
              <Star size={15} fill="currentColor" /> 4.8 (19)
            </span>
          </div>
          <strong className="detail-price">{formatEth(nft.price)}</strong>
          <p>{nft.description}</p>
          <h4>Edição:</h4>
          <div className="edition-list">
            <span>1/10</span>
            <span>1/10</span>
            <span className="active">{nft.edition}</span>
            <span>ABERTA</span>
          </div>
          <p>ID do token: #{nft.name.split("#")[1] || "0042"}</p>
          <p>Coleção: Kurio Apes</p>
          <p>Atributos: Óculos, Esmeralda, Raro</p>
          <div className="detail-buy">
            <div className="qty-control">
              <span>Qtd.</span>
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(Math.min(50, qty + 1))}>+</button>
            </div>
            <strong>{formatEth(nft.price * qty)}</strong>
            <button
              className="kurio-button"
              onClick={() => {
                addToCart(nft.id, qty);
                window.location.href = "/cart";
              }}
            >
              Comprar NFT
            </button>
            <button
              className="outline-button"
              onClick={() => addToCart(nft.id, qty)}
              aria-label="Adicionar ao carrinho"
            >
              <ShoppingCart size={19} />
            </button>
            <button
              className="outline-button"
              onClick={() => toggleFavorite(nft.id)}
              aria-label="Favoritar"
            >
              <Heart size={19} fill={liked ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>
      <section className="detail-description">
        <h3>Detalhes do NFT</h3>
        <p>
          {nft.description} Cada atributo fica armazenado nos metadados do token
          e verificado na Ethereum. A obra explora identidade, movimento e luz
          em um mundo digital sem fronteiras.
        </p>
        <p>
          A propriedade inclui a arte em alta resolução e um registro permanente
          de procedência na rede.
        </p>
        <h4>Rede:</h4>
        <p>{nft.network}</p>
      </section>
      <section className="related">
        <h3>Mais desta coleção</h3>
        <div className="nft-grid">
          {nfts
            .filter((n) => n.id !== id)
            .slice(0, 5)
            .map((n) => (
              <NftCard key={n.id} nft={n} />
            ))}
        </div>
      </section>
    </main>
  );
}
