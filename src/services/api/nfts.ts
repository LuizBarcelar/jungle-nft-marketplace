
import { api } from "./client";
import type { Nft } from "@/features/catalog/data";

export type NftFilters = {
  search?: string;
  category?: string;
  network?: string;
  sort?: string;
  page?: number;
  limit?: number;
};

export type NftsResponse = {
  data: Nft[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function getNfts(
  filters: NftFilters = {},
): Promise<NftsResponse> {
  const response = await api.get<NftsResponse>("/nfts", {
    params: filters,
  });

  return response.data;
}

export async function getNftById(id: string): Promise<Nft> {
  const response = await api.get<{ data: Nft }>(`/nfts/${id}`);

  return response.data.data;
}
