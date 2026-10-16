
import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

import { RootLayout } from "@/components/shared/RootLayout";
import { Home, type CatalogSearch } from "@/features/catalog/Home";
import { Detail } from "@/features/nft-detail/Detail";
import { CartPage } from "@/features/cart/CartPage";
import { FavoritesPage } from "@/features/favorites/FavoritesPage";
import { AuthPage } from "@/features/auth/AuthPage";
import { CheckoutPage } from "@/features/checkout/CheckoutPage";
import { ProfilePage } from "@/features/profile/ProfilePage";
import { WalletPage } from "@/features/profile/WalletPage";
import { CreatorsPage } from "@/features/creators/CreatorsPage";
import { LearnPage } from "@/features/learn/LearnPage";

import "@/Kurio.css";

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  validateSearch: (
    search: Record<string, unknown>,
  ): CatalogSearch => ({
    q:
      typeof search.q === "string"
        ? search.q
        : undefined,
    category:
      typeof search.category === "string"
        ? search.category
        : undefined,
    network:
      typeof search.network === "string"
        ? search.network
        : undefined,
    sort:
      typeof search.sort === "string"
        ? search.sort
        : undefined,
    tab:
      typeof search.tab === "string"
        ? search.tab
        : undefined,
    page:
      typeof search.page === "number"
        ? search.page
        : undefined,
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

const favoritesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/favorites",
  component: FavoritesPage,
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

const creatorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/creators",
  component: CreatorsPage,
});

const learnRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/learn",
  component: LearnPage,
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
  creatorsRoute,
  learnRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
