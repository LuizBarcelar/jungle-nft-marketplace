
import { test, expect } from "@playwright/test";

test.describe("Carrinho Kurio", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    // Limpa os dados locais do carrinho antes de cada teste.
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await page.reload();
  });

  test("deve mostrar mensagem quando o carrinho estiver vazio", async ({
    page,
  }) => {
    await page.goto("/cart");

    await expect(
      page.getByText("Seu carrinho está vazio."),
    ).toBeVisible();

    await expect(
      page.getByRole("link", {
        name: "Explorar NFTs",
      }),
    ).toBeVisible();
  });

  test("deve adicionar um NFT ao carrinho", async ({
    page,
  }) => {
    await page.goto("/nft/sage");

    const addButton = page.getByRole("button", {
      name: /adicionar ao carrinho/i,
    });

    await expect(addButton).toBeVisible();
    await addButton.click();

    await page.goto("/cart");

    await expect(
      page.locator(".cart-item"),
    ).toHaveCount(1);

    await expect(
      page.getByRole("heading", {
        name: "Carrinho de NFTs",
      }),
    ).toBeVisible();
  });

  test("deve aumentar e diminuir a quantidade", async ({
    page,
  }) => {
    await page.goto("/nft/sage");

    await page
      .getByRole("button", {
        name: /adicionar ao carrinho/i,
      })
      .click();

    await page.goto("/cart");

    const quantity = page.locator(".cart-qty");

    await expect(quantity.locator("span")).toHaveText("1");

    await quantity.getByRole("button", { name: "+" }).click();

    await expect(quantity.locator("span")).toHaveText("2");

    await quantity.getByRole("button", { name: "−" }).click();

    await expect(quantity.locator("span")).toHaveText("1");
  });

  test("deve remover um NFT do carrinho", async ({
    page,
  }) => {
    await page.goto("/nft/sage");

    await page
      .getByRole("button", {
        name: /adicionar ao carrinho/i,
      })
      .click();

    await page.goto("/cart");

    await expect(page.locator(".cart-item")).toHaveCount(1);

    await page
      .getByRole("button", {
        name: /remover/i,
      })
      .click();

    await expect(
      page.getByText("Seu carrinho está vazio."),
    ).toBeVisible();
  });
});
