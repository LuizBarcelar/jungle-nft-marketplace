import { useSyncExternalStore } from "react";
export type Cart = Record<string, number>;
const KEY = "kurio-cart-v1";
const FAV_KEY = "kurio-favorites-v1";
let cart: Cart = read<Cart>(KEY, {});
let favorites: string[] = read<string[]>(FAV_KEY, []);
const listeners = new Set<() => void>();
function read<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "") as T;
  } catch {
    return fallback;
  }
}
function notify() {
  listeners.forEach((fn) => fn());
}
function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
export function useCart() {
  return useSyncExternalStore(subscribe, () => cart);
}
export function useFavorites() {
  return useSyncExternalStore(subscribe, () => favorites);
}
export function setQuantity(id: string, qty: number) {
  const next = { ...cart };
  if (qty <= 0) delete next[id];
  else next[id] = Math.min(50, Math.floor(qty));
  cart = next;
  localStorage.setItem(KEY, JSON.stringify(cart));
  notify();
}
export function addToCart(id: string, qty = 1) {
  setQuantity(id, (cart[id] || 0) + qty);
}
export function toggleFavorite(id: string) {
  favorites = favorites.includes(id)
    ? favorites.filter((x) => x !== id)
    : [...favorites, id];
  localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
  notify();
}
export function clearCart() {
  cart = {};
  localStorage.setItem(KEY, "{}");
  notify();
}
