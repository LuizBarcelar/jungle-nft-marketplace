
import { nfts } from "@/features/catalog/data";
import { NftCard } from "@/components/shared/NftCard";
import { useFavorites } from "@/features/cart/store";

export function FavoritesPage() {
  const favorites = useFavorites();

  return (
    <main className="simple-page">
      <h1>Minha lista de interesse</h1>

      <div className="nft-grid">
        {nfts
          .filter((nft) => favorites.includes(nft.id))
          .map((nft) => (
            <NftCard key={nft.id} nft={nft} />
          ))}
      </div>

      {favorites.length === 0 && (
        <p>Você ainda não favoritou nenhum NFT.</p>
      )}
    </main>
  );
}
