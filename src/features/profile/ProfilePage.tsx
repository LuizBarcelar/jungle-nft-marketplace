
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  UserRound,
  Wallet,
  ShieldCheck,
  LogOut,
  ArrowRight,
} from "lucide-react";

import { getCurrentUser, logout } from "@/services/api/auth";

export function ProfilePage() {
  const token = sessionStorage.getItem("kurio-token");

  const { data: user, isPending, isError } = useQuery({
    queryKey: ["auth", "me", token],
    queryFn: () => getCurrentUser(token!),
    enabled: Boolean(token),
    retry: false,
  });

  async function handleLogout() {
    if (token) {
      try {
        await logout(token);
      } catch {
        // A sessão simulada pode já ter expirado.
      }
    }

    sessionStorage.removeItem("kurio-token");
    sessionStorage.removeItem("kurio-user");

    window.dispatchEvent(new Event("kurio-auth-changed"));
    window.location.assign("/login");
  }

  if (!token) {
    return (
      <main className="simple-page">
        <div className="mx-auto max-w-lg py-12 text-center">
          <UserRound size={48} className="mx-auto mb-5" />
          <h1 className="mb-4 text-3xl font-bold">
            Minha conta
          </h1>
          <p className="mb-8 text-gray-400">
            Entre na sua conta para visualizar seu perfil.
          </p>
          <Link to="/login" className="kurio-button">
            ENTRAR
          </Link>
        </div>
      </main>
    );
  }

  if (isPending) {
    return (
      <main className="simple-page">
        <p role="status">Carregando perfil...</p>
      </main>
    );
  }

  if (isError || !user) {
    return (
      <main className="simple-page">
        <h1 className="mb-4 text-2xl font-bold">
          Sessão expirada
        </h1>
        <p className="mb-6 text-gray-400">
          Faça login novamente para acessar seu perfil.
        </p>
        <button
          className="kurio-button"
          onClick={() => void handleLogout()}
        >
          VOLTAR AO LOGIN
        </button>
      </main>
    );
  }

  return (
    <main className="simple-page">
      <div className="mx-auto max-w-4xl py-10">
        <h1 className="mb-8 text-3xl font-bold">
          Meu perfil
        </h1>

        <div className="mb-8 rounded-2xl border border-gray-700 p-6">
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/20">
              <UserRound size={38} />
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                {user.name}
              </h2>
              <p className="text-gray-400">
                {user.email}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-green-400">
                <ShieldCheck size={16} />
                Conta autenticada
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <section className="rounded-2xl border border-gray-700 p-6">
            <Wallet size={30} className="mb-4" />

            <h2 className="mb-3 text-xl font-bold">
              Minha carteira
            </h2>

            <p className="mb-5 text-sm text-gray-400">
              Gerencie sua carteira digital simulada.
              Nenhuma conexão real será realizada.
            </p>

            <Link
              to="/wallet"
              className="inline-flex items-center gap-2 font-semibold"
            >
              Acessar carteira
              <ArrowRight size={18} />
            </Link>
          </section>

          <section className="rounded-2xl border border-gray-700 p-6">
            <ShieldCheck size={30} className="mb-4" />

            <h2 className="mb-3 text-xl font-bold">
              Minha coleção
            </h2>

            <p className="mb-5 text-sm text-gray-400">
              Consulte seus NFTs favoritos.
            </p>

            <Link
              to="/favorites"
              className="inline-flex items-center gap-2 font-semibold"
            >
              Ver favoritos
              <ArrowRight size={18} />
            </Link>
          </section>
        </div>

        <button
          type="button"
          onClick={() => void handleLogout()}
          className="mt-8 inline-flex items-center gap-2 rounded-lg border border-gray-600 px-5 py-3"
        >
          <LogOut size={18} />
          Sair da conta
        </button>
      </div>
    </main>
  );
}
