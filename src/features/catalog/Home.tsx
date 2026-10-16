
import { useEffect, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  Search,
  SlidersHorizontal,
  Activity,
  Wifi,
  WifiOff,
} from "lucide-react";

import { categories } from "./data";
import { useNfts } from "./hooks/useNfts";
import { useRealtimePrices } from "./hooks/useRealtimePrices";
import { NftCard } from "@/components/shared/NftCard";

export type CatalogSearch = {
  q?: string;
  category?: string;
  network?: string;
  sort?: string;
  tab?: string;
  page?: number;
};

const perPage = 6;

export function Home() {
  const search = useSearch({ from: "/" }) as CatalogSearch;
  const navigate = useNavigate({ from: "/" });

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draft, setDraft] = useState(search.q ?? "");

  // Socket.IO: atualizações demonstrativas em tempo real
  const { connected, updates } = useRealtimePrices();

  useEffect(() => {
    setDraft(search.q ?? "");
  }, [search.q]);

  const update = (patch: Partial<CatalogSearch>) =>
    navigate({
      to: "/",
      search: (old) => ({
        ...old,
        ...patch,
        page: 1,
      }),
    });

  const page = Math.max(1, search.page || 1);

  const sort =
    search.sort === "price-low"
      ? "price-asc"
      : search.sort === "price-high"
        ? "price-desc"
        : search.tab === "hot"
          ? "price-desc"
          : search.tab === "new"
            ? "new"
            : "recent";

  const {
    data,
    isPending,
    isFetching,
    isError,
    refetch,
  } = useNfts({
    search: search.q,
    category: search.category,
    network: search.network,
    sort,
    page,
    limit: perPage,
  });

  const nfts = data?.data ?? [];
  const totalPages = data?.pagination.totalPages ?? 0;

  // Mantém a última atualização recebida de cada NFT.
  const recentUpdates = Object.values(updates)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime(),
    )
    .slice(0, 5);

  return (
    <main>
      {/* HERO */}
      <section className="kurio-hero">
        <div className="hero-copy">
          <span>Bem-vindo à Kurio</span>

          <h1>
            SEJA DONO DO FUTURO
            <br />
            DA ARTE DIGITAL
          </h1>

          <p>
            Descubra NFTs selecionados de criadores emergentes e
            consagrados. Colecione arte digital rara, apoie artistas
            e tenha uma parte da cultura da internet.
          </p>

          <a className="kurio-button" href="#catalog">
            EXPLORAR
          </a>
        </div>

        <div className="hero-image">
          <img
            src="/nfts/emerald.jpg"
            alt="Emerald Ape da coleção Kurio"
          />
        </div>
      </section>

      {/* BUSCA MOBILE */}
      <form
        className="mobile-search"
        onSubmit={(event) => {
          event.preventDefault();
          update({ q: draft.trim() || undefined });
        }}
      >
        <Search size={20} />

        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Explorar coleções"
          aria-label="Buscar NFTs"
        />

        <button
          type="button"
          onClick={() => setFiltersOpen(!filtersOpen)}
          aria-label="Abrir filtros"
        >
          <SlidersHorizontal />
        </button>
      </form>

      {/* CATÁLOGO */}
      <div className="market-layout" id="catalog">
        {/* FILTROS */}
        <aside
          className={`market-sidebar ${
            filtersOpen ? "show" : ""
          }`}
        >
          <h3>Coleções</h3>

          {categories.map((category, index) => (
            <button
              key={category}
              type="button"
              className={
                search.category === category ? "chosen" : ""
              }
              onClick={() =>
                update({
                  category:
                    search.category === category
                      ? undefined
                      : category,
                })
              }
            >
              {category}

              <span>
                ({[33, 12, 65, 39, 23, 17, 19, 13, 18][index]})
              </span>
            </button>
          ))}

          <h3>Faixa de preço</h3>

          <p className="filter-hint">
            Preço: 0,02 - 12,30 ETH
          </p>

          <h3>Rede</h3>

          {["Ethereum", "Polygon", "Solana"].map(
            (network) => (
              <button
                key={network}
                type="button"
                className={
                  search.network === network ? "chosen" : ""
                }
                onClick={() =>
                  update({
                    network:
                      search.network === network
                        ? undefined
                        : network,
                  })
                }
              >
                {network}
              </button>
            ),
          )}

          <button
            type="button"
            className="clear-filters"
            onClick={() =>
              navigate({ to: "/", search: {} })
            }
          >
            Limpar filtros
          </button>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <section className="market-main">
          {/* STATUS SOCKET.IO */}
          <div
            role="status"
            aria-live="polite"
            className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full ${
                connected
                  ? "bg-green-500/15 text-green-400"
                  : "bg-orange-500/15 text-orange-400"
              }`}
            >
              {connected ? (
                <Wifi size={18} />
              ) : (
                <WifiOff size={18} />
              )}
            </span>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold">
                {connected
                  ? "Mercado ao vivo"
                  : "Mercado em tempo real indisponível"}
              </span>

              <span className="text-xs text-white/60">
                {connected
                  ? "Recebendo variações demonstrativas via Socket.IO"
                  : "Aguardando conexão com o servidor Socket.IO"}
              </span>
            </div>

            {connected && (
              <span className="ml-auto flex items-center gap-2 text-xs text-green-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                Conectado
              </span>
            )}
          </div>

          {/* BARRA DE FILTROS E ORDENAÇÃO */}
          <div className="market-toolbar">
            <div className="market-tabs">
              <button
                type="button"
                className={
                  !search.tab || search.tab === "all"
                    ? "selected"
                    : ""
                }
                onClick={() => update({ tab: "all" })}
              >
                Todos os NFTs
              </button>

              <button
                type="button"
                className={
                  search.tab === "new" ? "selected" : ""
                }
                onClick={() => update({ tab: "new" })}
              >
                Novos lançamentos
              </button>

              <button
                type="button"
                className={
                  search.tab === "hot" ? "selected" : ""
                }
                onClick={() => update({ tab: "hot" })}
              >
                Em alta
              </button>
            </div>

            <label className="sort-label">
              Ordenar por:{" "}
              <select
                value={search.sort || "recent"}
                onChange={(event) =>
                  update({ sort: event.target.value })
                }
              >
                <option value="recent">
                  Listados recentemente
                </option>

                <option value="price-low">
                  Menor preço
                </option>

                <option value="price-high">
                  Maior preço
                </option>
              </select>
            </label>
          </div>

          {/* CARREGAMENTO */}
          {isPending && (
            <p role="status" className="empty-state">
              Carregando NFTs...
            </p>
          )}

          {isFetching && !isPending && (
            <p role="status" className="filter-hint">
              Atualizando catálogo...
            </p>
          )}

          {/* ERRO */}
          {isError && (
            <div role="alert" className="empty-state">
              <p>Não foi possível carregar os NFTs.</p>

              <button
                type="button"
                className="kurio-button"
                onClick={() => void refetch()}
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* GRADE DE NFTs */}
          {!isError && (
            <div className="nft-grid">
              {nfts.map((nft) => (
                <NftCard key={nft.id} nft={nft} />
              ))}
            </div>
          )}

          {/* RESULTADO VAZIO */}
          {!isPending &&
            !isError &&
            nfts.length === 0 && (
              <p className="empty-state">
                Nenhum NFT encontrado. Tente outros filtros.
              </p>
            )}

          {/* PAGINAÇÃO */}
          {!isPending && !isError && (
            <div className="pagination">
              {Array.from(
                { length: totalPages },
                (_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={
                      page === index + 1 ? "active" : ""
                    }
                    onClick={() =>
                      navigate({
                        to: "/",
                        search: (old) => ({
                          ...old,
                          page: index + 1,
                        }),
                      })
                    }
                  >
                    {index + 1}
                  </button>
                ),
              )}
            </div>
          )}

          {/* ATUALIZAÇÕES EM TEMPO REAL */}
          <section
            aria-label="Variações do mercado em tempo real"
            className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <div className="mb-5 flex items-center gap-3">
              <Activity
                size={20}
                className="text-green-400"
              />

              <div>
                <h2 className="text-lg font-bold">
                  Variações do mercado
                </h2>

                <p className="mt-1 text-xs text-white/60">
                  Dados simulados atualizados em tempo real
                </p>
              </div>
            </div>

            {recentUpdates.length === 0 ? (
              <p className="text-sm text-white/60">
                {connected
                  ? "Aguardando a primeira atualização do mercado..."
                  : "Conecte o servidor Socket.IO para receber atualizações."}
              </p>
            ) : (
              <div className="space-y-3">
                {recentUpdates.map((item) => (
                  <div
                    key={item.nftId}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/10 px-4 py-3"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">
                        NFT #{item.nftId}
                      </span>

                      <span className="text-xs text-white/50">
                        {new Date(
                          item.timestamp,
                        ).toLocaleTimeString("pt-BR")}
                      </span>
                    </div>

                    <strong
                      className={`text-sm ${
                        item.changePercent >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {item.changePercent > 0 ? "+" : ""}
                      {item.changePercent.toFixed(2)}%
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </section>
        </section>
      </div>

      {/* BANNERS PROMOCIONAIS */}
      <section className="promo-row">
        <div>
          <img
            src="/nfts/emerald.jpg"
            alt="Coleção Emerald"
          />

          <p>
            Lançamentos de edição limitada
            <br />
            <a href="#catalog">Explorar →</a>
          </p>
        </div>

        <div>
          <img
            src="/nfts/neon.jpg"
            alt="Coleção Neon"
          />

          <p>
            Arte digital selecionada e muito mais
            <br />
            <a href="#catalog">Explorar →</a>
          </p>
        </div>
      </section>
    </main>
  );
}
