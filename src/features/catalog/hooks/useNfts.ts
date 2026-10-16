
import { useQuery } from "@tanstack/react-query";
import {
  getNfts,
  type NftFilters,
} from "@/services/api/nfts";

export function useNfts(filters: NftFilters = {}) {
  return useQuery({
    queryKey: ["nfts", filters],
    queryFn: () => getNfts(filters),
    placeholderData: (previousData) => previousData,
  });
}
