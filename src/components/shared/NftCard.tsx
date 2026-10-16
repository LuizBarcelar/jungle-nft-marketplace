import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart } from "lucide-react";
import type { Nft } from "@/features/catalog/data";
import { formatEth } from "@/features/catalog/data";
import { addToCart, toggleFavorite, useFavorites } from "@/features/cart/store";
export function NftCard({ nft }: { nft: Nft }) {
  const favorites = useFavorites();
  const liked = favorites.includes(nft.id);
  return (
    <article className="nft-card">
      <div className="nft-picture">
        <Link to="/nft/$id" params={{ id: nft.id }}>
          <img src={nft.image} alt={nft.name} loading="lazy" />
        </Link>
        {nft.rare && <span className="rare-tag">RARO</span>}
        <div className="nft-card-actions">
          <button
            onClick={() => addToCart(nft.id)}
            title="Adicionar ao carrinho"
            aria-label={`Adicionar ${nft.name} ao carrinho`}
          >
            <ShoppingCart size={18} />
          </button>
          <button
            onClick={() => toggleFavorite(nft.id)}
            aria-label={
              liked ? "Remover dos favoritos" : "Adicionar aos favoritos"
            }
          >
            <Heart size={18} fill={liked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
      <Link className="nft-name" to="/nft/$id" params={{ id: nft.id }}>
        {nft.name}
      </Link>
      <div className="nft-price">{formatEth(nft.price)}</div>
    </article>
  );
}
