import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import { Shell } from "@/components/shared/Shell";
import { Home, type CatalogSearch } from "@/features/catalog/Home";
import { Detail } from "@/features/nft-detail/Detail";
import { CartPage } from "@/features/cart/CartPage";
import { nfts } from "@/features/catalog/data";
import { NftCard } from "@/components/shared/NftCard";
import { useFavorites } from "@/features/cart/store";
import "@/kurio.css";
import { AuthPage } from "@/features/auth/AuthPage";
import { CheckoutPage } from "@/features/checkout/CheckoutPage";
import { ProfilePage } from "@/features/profile/ProfilePage";
import { WalletPage } from "@/features/profile/WalletPage";
function Root() {
  return (
    <Shell>
      <Outlet />
    </Shell>
  );
}
const rootRoute = createRootRoute({ component: Root });
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  validateSearch: (search: Record<string, unknown>): CatalogSearch => ({
    q: typeof search.q === "string" ? search.q : undefined,
    category: typeof search.category === "string" ? search.category : undefined,
    network: typeof search.network === "string" ? search.network : undefined,
    sort: typeof search.sort === "string" ? search.sort : undefined,
    tab: typeof search.tab === "string" ? search.tab : undefined,
    page: typeof search.page === "number" ? search.page : undefined,
  }),
  component: Home,
});
const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nft/$id",
  component: Detail,
});
const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});
function Favorites() {
  const favorites = useFavorites();
  return (
    <main className="simple-page">
      <h1>Minha lista de interesse</h1>
      <div className="nft-grid">
        {nfts
          .filter((n) => favorites.includes(n.id))
          .map((n) => (
            <NftCard key={n.id} nft={n} />
          ))}
      </div>
      {favorites.length === 0 && <p>Você ainda não favoritou nenhum NFT.</p>}
    </main>
  );
}
const favoritesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/favorites",
  component: Favorites,
});
const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  validateSearch: (
    search: Record<string, unknown>,
  ): { redirect?: "/checkout" } => ({
    redirect:
      search.redirect === "/checkout"
        ? "/checkout"
        : undefined,
  }),
  component: AuthPage,
});
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});
const walletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wallet",
  component: WalletPage,
});
const routeTree = rootRoute.addChildren([
  indexRoute,
  detailRoute,
  cartRoute,
  favoritesRoute,
  checkoutRoute,
  loginRoute,
  profileRoute,
  walletRoute,
]);
export const router = createRouter({ routeTree, defaultPreload: "intent" });
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
