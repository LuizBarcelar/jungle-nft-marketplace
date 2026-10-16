
import { test, expect } from "@playwright/test";

test.describe("Catálogo Kurio", () => {
  test("deve carregar a página inicial", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        name: /seja dono do futuro/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("button", {
        name: "Todos os NFTs",
      }),
    ).toBeVisible();
  });

  test("deve exibir os NFTs do catálogo", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.locator(".nft-grid"),
    ).toBeVisible();

    await expect
      .poll(async () =>
        page.locator(".nft-grid > *").count(),
      )
      .toBeGreaterThan(0);
  });

  test("deve permitir selecionar a aba de lançamentos", async ({
    page,
  }) => {
    await page.goto("/");

    const newTab = page.getByRole("button", {
      name: "Novos lançamentos",
    });

    await newTab.click();

    await expect(newTab).toHaveClass(/selected/);
  });

  test("deve permitir alterar a ordenação", async ({ page }) => {
    await page.goto("/");

    const sort = page.getByRole("combobox", {
      name: /ordenar por/i,
    });

    await sort.selectOption("price-low");

    await expect(sort).toHaveValue("price-low");
  });
});
