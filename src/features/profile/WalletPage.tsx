
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Wallet,
  CheckCircle2,
  Unplug,
} from "lucide-react";

export function WalletPage() {
  const [connected, setConnected] = useState(false);

  return (
    <main className="simple-page">
      <div className="mx-auto max-w-2xl py-10">
        <h1 className="mb-4 text-3xl font-bold">
          Minha carteira
        </h1>

        <p className="mb-8 text-gray-400">
          Simule a conexão de uma carteira digital
          para explorar os recursos da Kurio.
        </p>

        <div className="rounded-2xl border border-gray-700 p-8">
          <Wallet size={40} className="mb-5" />

          <h2 className="mb-3 text-xl font-bold">
            Carteira de demonstração
          </h2>

          {connected ? (
            <>
              <p
                role="status"
                className="mb-5 flex items-center gap-2 text-green-400"
              >
                <CheckCircle2 size={20} />
                Carteira simulada conectada
              </p>

              <p className="mb-5 text-sm text-gray-400">
                Rede: Ethereum (simulada)
              </p>

              <button
                type="button"
                className="kurio-button inline-flex items-center gap-2"
                onClick={() => setConnected(false)}
              >
                <Unplug size={18} />
                DESCONECTAR
              </button>
            </>
          ) : (
            <>
              <p className="mb-6 text-gray-400">
                Esta conexão é apenas demonstrativa.
                Não é necessário instalar extensões
                ou informar dados de uma carteira real.
              </p>

              <button
                type="button"
                className="kurio-button"
                onClick={() => setConnected(true)}
              >
                CONECTAR CARTEIRA DEMO
              </button>
            </>
          )}
        </div>

        <div className="mt-8">
          <Link to="/profile">
            ← Voltar ao perfil
          </Link>
        </div>
      </div>
    </main>
  );
}
