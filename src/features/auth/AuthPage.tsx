
import { useState, type FormEvent } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

import {
  login,
  register,
  type AuthResponse,
} from "@/services/api/auth";

type Mode = "login" | "register";

export function AuthPage() {
  const navigate = useNavigate();

  const search = useSearch({
    from: "/login",
  });

  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: (): Promise<AuthResponse> =>
      mode === "login"
        ? login({ email, password })
        : register({ name, email, password }),

    onSuccess: ({ token, user }) => {
      sessionStorage.setItem("kurio-token", token);
      sessionStorage.setItem(
        "kurio-user",
        JSON.stringify(user),
      );
      window.dispatchEvent(new Event("kurio-auth-changed"));

      
      if (search.redirect === "/checkout") {
        void navigate({ to: "/checkout" });
      } else {
        void navigate({ to: "/profile" });
      }
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutation.mutate();
  }

  function changeMode(nextMode: Mode) {
    setMode(nextMode);
    mutation.reset();
  }

  const errorMessage =
    mutation.error instanceof AxiosError
      ? mutation.error.response?.data?.message ??
        "Não foi possível autenticar."
      : "Ocorreu um erro. Tente novamente.";

  return (
    <main className="simple-page">
      <div className="mx-auto w-full max-w-md py-10">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <LockKeyhole size={32} />
          </div>

          <h1 className="text-3xl font-bold">
            {mode === "login"
              ? "Entrar na Kurio"
              : "Criar minha conta"}
          </h1>

          <p className="mt-3 text-sm text-gray-400">
            {mode === "login"
              ? "Acesse sua conta para continuar."
              : "Cadastre-se para começar sua coleção."}
          </p>
        </div>

        <div className="mb-6 flex gap-3">
          <button
            type="button"
            className="kurio-button flex-1"
            aria-pressed={mode === "login"}
            onClick={() => changeMode("login")}
          >
            Entrar
          </button>

          <button
            type="button"
            className="kurio-button flex-1"
            aria-pressed={mode === "register"}
            onClick={() => changeMode("register")}
          >
            Cadastrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === "register" && (
            <div>
              <label
                htmlFor="auth-name"
                className="mb-2 block"
              >
                Nome
              </label>

              <input
                id="auth-name"
                type="text"
                required
                minLength={2}
                autoComplete="name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                className="w-full rounded-lg border border-gray-600 bg-transparent p-3"
                placeholder="Seu nome"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="auth-email"
              className="mb-2 block"
            >
              E-mail
            </label>

            <input
              id="auth-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              className="w-full rounded-lg border border-gray-600 bg-transparent p-3"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="auth-password"
              className="mb-2 block"
            >
              Senha
            </label>

            <div className="relative">
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                required
                minLength={
                  mode === "register" ? 8 : undefined
                }
                autoComplete={
                  mode === "login"
                    ? "current-password"
                    : "new-password"
                }
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                className="w-full rounded-lg border border-gray-600 bg-transparent p-3 pr-12"
                placeholder="Digite sua senha"
              />

              <button
                type="button"
                aria-label={
                  showPassword
                    ? "Ocultar senha"
                    : "Mostrar senha"
                }
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-3 top-3"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {mutation.isError && (
            <p
              role="alert"
              className="text-sm text-red-400"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="kurio-button w-full disabled:opacity-50"
          >
            {mutation.isPending
              ? "Aguarde..."
              : mode === "login"
                ? "ENTRAR"
                : "CRIAR CONTA"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Ambiente de demonstração. Não utilize senhas reais.
        </p>
      </div>
    </main>
  );
}
