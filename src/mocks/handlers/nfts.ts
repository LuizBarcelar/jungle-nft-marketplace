
import { http, HttpResponse } from "msw";
import { nfts } from "@/features/catalog/data";

export const nftHandlers = [
  http.get("/api/nfts", ({ request }) => {
    const url = new URL(request.url);

    const search = url.searchParams.get("search")?.toLowerCase() ?? "";
    const category = url.searchParams.get("category");
    const network = url.searchParams.get("network");
    const sort = url.searchParams.get("sort") ?? "recent";
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const limit = Math.min(
      50,
      Math.max(1, Number(url.searchParams.get("limit")) || 9),
    );

    let result = nfts.filter((nft) => {
      const matchesSearch = nft.name.toLowerCase().includes(search);
      const matchesCategory =
        !category || category === "all" || nft.category === category;

      const matchesNetwork = !network || nft.network === network;

      return matchesSearch && matchesCategory && matchesNetwork;
    });

    if (sort === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sort === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    if (sort === "new") {
      result = [...result].reverse();
    }

    const total = result.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;

    return HttpResponse.json({
      data: result.slice(start, start + limit),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  }),

  http.get("/api/nfts/:id", ({ params }) => {
    const nft = nfts.find((item) => item.id === params.id);

    if (!nft) {
      return HttpResponse.json(
        { message: "NFT não encontrado" },
        { status: 404 },
      );
    }

    return HttpResponse.json({ data: nft });
  }),
];
