
import { test, expect, type Page } from "@playwright/test";

const password = "KurioTeste123!";

function uniqueUser() {
  const id = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;

  return {
    name: "Usuario Teste Kurio",
    email: `teste-${id}@example.com`,
    password,
  };
}

async function registerUser(
  page: Page,
  user: ReturnType<typeof uniqueUser>,
) {
  await page.goto("/login");

  await page
    .getByRole("button", {
      name: "Cadastrar",
      exact: true,
    })
    .click();

  await page.getByLabel("Nome").fill(user.name);
  await page.getByLabel("E-mail").fill(user.email);
  await page.getByLabel("Senha", { exact: true }).fill(
    user.password,
  );

  await page
    .getByRole("button", {
      name: "CRIAR CONTA",
    })
    .click();

  await expect(page).toHaveURL(/\/profile(?:\?|$)/);

  await expect(
    page.getByRole("heading", {
      name: /perfil/i,
    }),
  ).toBeVisible();
}

async function logoutUser(page: Page) {
  await page.getByRole("button", {
    name: /sair/i,
  }).click();

  await expect(
    page.getByRole("link", {
      name: "Entrar",
      exact: true,
    }),
  ).toBeVisible();
}

test.describe("Autenticação Kurio", () => {
  test("deve cadastrar um usuário e abrir o perfil", async ({
    page,
  }) => {
    const user = uniqueUser();

    await registerUser(page, user);

    await expect(
      page.getByText(user.email),
    ).toBeVisible();
  });

  test("deve permitir login com uma conta cadastrada", async ({
    page,
  }) => {
    const user = uniqueUser();

    await registerUser(page, user);
    await logoutUser(page);

    await page.goto("/login");

    await page.getByLabel("E-mail").fill(user.email);

    await page
      .getByLabel("Senha", { exact: true })
      .fill(user.password);

    await page
      .getByRole("button", {
        name: "ENTRAR",
        exact: true,
      })
      .click();

    await expect(page).toHaveURL(/\/profile(?:\?|$)/);

    await expect(
      page.getByText(user.email),
    ).toBeVisible();
  });

  test("deve manter a sessão após atualizar a página", async ({
    page,
  }) => {
    const user = uniqueUser();

    await registerUser(page, user);

    await page.reload();

    await expect(
      page.getByText(user.email),
    ).toBeVisible();

    await expect(
      page.getByRole("link", {
        name: "Meu perfil",
      }),
    ).toBeVisible();
  });

  test("deve realizar logout corretamente", async ({
    page,
  }) => {
    const user = uniqueUser();

    await registerUser(page, user);
    await logoutUser(page);

    const token = await page.evaluate(() =>
      sessionStorage.getItem("kurio-token"),
    );

    expect(token).toBeNull();
  });

  test("deve impedir login com senha incorreta", async ({
    page,
  }) => {
    const user = uniqueUser();

    await registerUser(page, user);
    await logoutUser(page);

    await page.goto("/login");

    await page.getByLabel("E-mail").fill(user.email);

    await page
      .getByLabel("Senha", { exact: true })
      .fill("SenhaIncorreta123!");

    await page
      .getByRole("button", {
        name: "ENTRAR",
        exact: true,
      })
      .click();

    await expect(
      page.getByRole("alert"),
    ).toBeVisible();

    await expect(page).toHaveURL(/\/login/);
  });
});
