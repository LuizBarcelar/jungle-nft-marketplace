import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Heart,
  Home,
  Search,
  ShoppingCart,
  UserRound,
  SlidersHorizontal,
} from "lucide-react";

import { useCart } from "@/features/cart/store";

export function Shell({
  children,
}: {
  children: React.ReactNode;
}) {
  const cart = useCart();

  const count = Object.values(cart).reduce(
    (sum, n) => sum + n,
    0,
  );

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    Boolean(sessionStorage.getItem("kurio-token")),
  );

  useEffect(() => {
    function updateAuth() {
      setIsLoggedIn(
        Boolean(sessionStorage.getItem("kurio-token")),
      );
    }

    window.addEventListener("kurio-auth-changed", updateAuth);

    return () => {
      window.removeEventListener(
        "kurio-auth-changed",
        updateAuth,
      );
    };
  }, []);

  return (
    <div className="kurio-app">
      <header className="kurio-header">
        <div className="kurio-header-inner">
          <Link to="/" className="kurio-brand">
            KURIO
          </Link>

          <nav className="kurio-desktop-nav">
            <Link
              to="/"
              activeProps={{ className: "active" }}
            >
              Início
            </Link>

            <Link
              to="/"
              search={{ tab: "all" }}
              activeProps={{ className: "active" }}
            >
              Mercado
            </Link>

            <Link
              to="/creators"
              activeProps={{ className: "active" }}
            >
              Criadores
            </Link>

            <Link
              to="/learn"
              activeProps={{ className: "active" }}
            >
              Aprenda
            </Link>
          </nav>

          <div className="kurio-header-actions">
            <Link to="/" aria-label="Pesquisar">
              <Search size={20} />
            </Link>

            <Link
              to="/favorites"
              aria-label="Favoritos"
              title="Favoritos"
            >
              <Heart size={20} />
            </Link>

            <Link
              to="/cart"
              aria-label="Carrinho"
              className="cart-link"
            >
              <ShoppingCart size={21} />

              {count > 0 && (
                <span className="cart-count">
                  {count}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <Link
                to="/profile"
                aria-label="Meu perfil"
                title="Meu perfil"
              >
                <UserRound size={21} />
              </Link>
            ) : (
              <Link
                to="/login"
                className="kurio-button small"
              >
                Entrar
              </Link>
            )}

          </div>
        </div>
      </header>

      <div className="kurio-content">
        <nav
          className="kurio-mobile-extra-links"
          aria-label="Explorar Kurio"
        >
          <Link
            to="/creators"
            activeProps={{ className: "active" }}
          >
            Criadores
          </Link>

          <Link
            to="/learn"
            activeProps={{ className: "active" }}
          >
            Aprenda
          </Link>
        </nav>

        {children}
      </div>

      <footer className="kurio-footer">
        <div className="footer-benefits">
          <div>
            <b className="round-letter">W</b>
            <strong>Segurança da carteira</strong>
            <p>
              Proteja sua carteira e colecione arte
              digital verificada com confiança.
            </p>
          </div>

          <div>
            <b className="round-letter">C</b>
            <strong>Criadores em destaque</strong>
            <p>
              Conheça artistas, estúdios e comunidades
              que moldam a cultura digital.
            </p>
          </div>

          <div>
            <b className="round-letter">D</b>
            <strong>Alertas de lançamentos</strong>
            <p>
              Receba novidades de coleções e do mercado.
            </p>
          </div>

          <div>
            <strong>
              Antecipe-se ao próximo lançamento
            </strong>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                alert(
                  "Inscrição demonstrativa registrada!",
                );
              }}
            >
              <input
                type="email"
                placeholder="digite seu e-mail..."
                required
              />

              <button className="kurio-button">
                Enviar
              </button>
            </form>
          </div>
        </div>

        <div className="footer-base">
          <b>KURIO</b>
          <span>
            Feito para colecionadores, criadores e cultura
          </span>
          <span>contato@email.com</span>
          <span>© 2026 Kurio</span>
        </div>
      </footer>

      <nav
        className="kurio-mobile-nav"
        aria-label="Navegação principal"
      >
        <Link
          to="/"
          aria-label="Início"
          className={
            pathname === "/" ? "selected" : ""
          }
        >
          <Home />
        </Link>

        <Link
          to="/favorites"
          aria-label="Favoritos"
          className={
            pathname === "/favorites"
              ? "selected"
              : ""
          }
        >
          <Heart />
        </Link>

        <Link
          to="/"
          aria-label="Explorar"
          className="nav-center"
        >
          <SlidersHorizontal />
        </Link>

        <Link
          to="/cart"
          aria-label="Carrinho"
          className={
            pathname === "/cart" ? "selected" : ""
          }
        >
          <ShoppingCart />

          {count > 0 && (
            <span className="cart-count">
              {count}
            </span>
          )}
        </Link>

        <Link
          to="/profile"
          aria-label="Meu perfil"
          className={
            pathname === "/profile"
              ? "selected"
              : ""
          }
        >
          <UserRound />
        </Link>
      </nav>
    </div>
  );
}
