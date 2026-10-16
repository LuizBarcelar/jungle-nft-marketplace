
import { http, HttpResponse } from "msw";

type User = {
  id: string;
  name: string;
  email: string;
};

type StoredUser = User & {
  password: string;
};

const USERS_KEY = "kurio-mock-users-v1";
const SESSIONS_KEY = "kurio-mock-sessions-v1";

const defaultUsers: StoredUser[] = [
  {
    id: "user-demo",
    name: "Colecionador Kurio",
    email: "demo@kurio.com",
    password: "Demo1234!",
  },
];

// Recupera os usuários cadastrados no ambiente simulado.
function loadUsers(): StoredUser[] {
  try {
    const stored = localStorage.getItem(USERS_KEY);

    if (!stored) return [...defaultUsers];

    const savedUsers = JSON.parse(stored) as StoredUser[];

    if (!Array.isArray(savedUsers)) {
      return [...defaultUsers];
    }

    return [
      ...defaultUsers,
      ...savedUsers.filter(
        (saved) =>
          saved.id !== "user-demo" &&
          !defaultUsers.some(
            (user) => user.email === saved.email,
          ),
      ),
    ];
  } catch {
    return [...defaultUsers];
  }
}

// Recupera as sessões após atualizar o navegador.
function loadSessions(): Map<string, string> {
  try {
    const stored = localStorage.getItem(SESSIONS_KEY);

    if (!stored) return new Map<string, string>();

    const entries = JSON.parse(stored) as Array<
      [string, string]
    >;

    return new Map<string, string>(entries);
  } catch {
    return new Map<string, string>();
  }
}

const users = loadUsers();
const sessions = loadSessions();

// Persiste os usuários de demonstração.
function saveUsers(): void {
  const registeredUsers = users.filter(
    (user) => user.id !== "user-demo",
  );

  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(registeredUsers),
  );
}

// Persiste as sessões de demonstração.
function saveSessions(): void {
  localStorage.setItem(
    SESSIONS_KEY,
    JSON.stringify([...sessions.entries()]),
  );
}

// Retorna o usuário associado ao token.
export function getAuthenticatedUser(
  request: Request,
): User | null {
  const authorization =
    request.headers.get("Authorization");

  const token = authorization?.replace(
    /^Bearer\s+/i,
    "",
  );

  if (!token) return null;

  const userId = sessions.get(token);

  if (!userId) return null;

  const user = users.find(
    (item) => item.id === userId,
  );

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

export const authHandlers = [
  // LOGIN
  http.post("/api/auth/login", async ({ request }) => {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    const user = users.find(
      (item) =>
        item.email.toLowerCase() === email &&
        item.password === password,
    );

    if (!user) {
      return HttpResponse.json(
        {
          message: "E-mail ou senha inválidos.",
        },
        {
          status: 401,
        },
      );
    }

    const token = crypto.randomUUID();

    sessions.set(token, user.id);
    saveSessions();

    return HttpResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  }),

  // CADASTRO
  http.post("/api/auth/register", async ({ request }) => {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (
      !name ||
      !email ||
      !password ||
      password.length < 8
    ) {
      return HttpResponse.json(
        {
          message:
            "Informe nome, e-mail e senha de pelo menos 8 caracteres.",
        },
        {
          status: 400,
        },
      );
    }

    const emailExists = users.some(
      (user) =>
        user.email.toLowerCase() === email,
    );

    if (emailExists) {
      return HttpResponse.json(
        {
          message: "Este e-mail já está cadastrado.",
        },
        {
          status: 409,
        },
      );
    }

    const user: StoredUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
    };

    users.push(user);
    saveUsers();

    const token = crypto.randomUUID();

    sessions.set(token, user.id);
    saveSessions();

    return HttpResponse.json(
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      {
        status: 201,
      },
    );
  }),

  // USUÁRIO AUTENTICADO
  http.get("/api/auth/me", ({ request }) => {
    const user = getAuthenticatedUser(request);

    if (!user) {
      return HttpResponse.json(
        {
          message: "Não autenticado.",
        },
        {
          status: 401,
        },
      );
    }

    return HttpResponse.json({
      user,
    });
  }),

  // LOGOUT
  http.post("/api/auth/logout", ({ request }) => {
    const authorization =
      request.headers.get("Authorization");

    const token = authorization?.replace(
      /^Bearer\s+/i,
      "",
    );

    if (token) {
      sessions.delete(token);
      saveSessions();
    }

    return HttpResponse.json({
      success: true,
    });
  }),
];
