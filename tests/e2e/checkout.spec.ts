
import { test, expect, type Page } from "@playwright/test";

async function addNftToCart(page: Page) {
  await page.goto("/nft/sage");

  await page
    .getByRole("button", {
      name: /adicionar ao carrinho/i,
    })
    .click();
}

test.describe("Checkout Kurio", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await page.reload();
  });

  test("deve informar quando o carrinho estiver vazio", async ({
    page,
  }) => {
    await page.goto("/checkout");

    await expect(
      page.getByRole("heading", {
        name: "Seu carrinho está vazio",
      }),
    ).toBeVisible();
  });

  test("deve exibir o resumo do pedido", async ({
    page,
  }) => {
    await addNftToCart(page);

    await page.goto("/checkout");

    await expect(
      page.getByRole("heading", {
        name: "Finalizar compra",
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        name: "Resumo do pedido",
      }),
    ).toBeVisible();

    await expect(
      page.getByText("Taxa de rede simulada"),
    ).toBeVisible();
  });

  test("deve solicitar login antes de finalizar", async ({
    page,
  }) => {
    await addNftToCart(page);

    await page.goto("/checkout");

    await page
      .getByRole("button", {
        name: "ENTRAR PARA CONTINUAR",
      })
      .click();

    await expect(page).toHaveURL(/\/login/);

    await expect(
      page.getByRole("heading", {
        name: "Entrar na Kurio",
      }),
    ).toBeVisible();
  });

  test("deve concluir uma compra demonstrativa", async ({
    page,
  }) => {
    const email = `checkout-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}@example.com`;

    await addNftToCart(page);

    await page.goto("/checkout");

    await page
      .getByRole("button", {
        name: "ENTRAR PARA CONTINUAR",
      })
      .click();

    await page
      .getByRole("button", {
        name: "Cadastrar",
        exact: true,
      })
      .click();

    await page.getByLabel("Nome").fill("Teste Checkout");
    await page.getByLabel("E-mail").fill(email);

    await page
      .getByLabel("Senha", { exact: true })
      .fill("KurioTeste123!");

    await page
      .getByRole("button", {
        name: "CRIAR CONTA",
      })
      .click();

    await expect(page).toHaveURL(/\/checkout(?:\?|$)/);

    await page
      .getByRole("button", {
        name: "CONFIRMAR COMPRA",
      })
      .click();

    await expect(
      page.getByRole("heading", {
        name: "Pedido confirmado!",
      }),
    ).toBeVisible();

    await expect(
      page.getByText(
        "Sua compra foi registrada com sucesso no ambiente de demonstração da Kurio.",
      ),
    ).toBeVisible();

    await page.goto("/cart");

    await expect(
      page.getByText("Seu carrinho está vazio."),
    ).toBeVisible();
  });
});
