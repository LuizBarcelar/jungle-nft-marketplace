
import { api } from "./client";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = LoginInput & {
  name: string;
};

export async function login(
  input: LoginInput,
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>(
    "/auth/login",
    input,
  );

  return response.data;
}

export async function register(
  input: RegisterInput,
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>(
    "/auth/register",
    input,
  );

  return response.data;
}

export async function getCurrentUser(
  token: string,
): Promise<AuthUser> {
  const response = await api.get<{ user: AuthUser }>(
    "/auth/me",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.user;
}

export async function logout(token: string): Promise<void> {
  await api.post(
    "/auth/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
