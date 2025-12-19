import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useStats() {
  const { data: current, isLoading: isLoadingCurrent } = useQuery({
    queryKey: [api.stats.current.path],
    queryFn: async () => {
      const res = await fetch(api.stats.current.path);
      if (!res.ok) throw new Error("Failed to fetch stats");
      return api.stats.current.responses[200].parse(await res.json());
    },
    refetchInterval: 2000, // Poll every 2 seconds
  });

  const { data: history, isLoading: isLoadingHistory } = useQuery({
    queryKey: [api.stats.history.path],
    queryFn: async () => {
      const res = await fetch(api.stats.history.path);
      if (!res.ok) throw new Error("Failed to fetch history");
      return api.stats.history.responses[200].parse(await res.json());
    },
    refetchInterval: 10000, // Poll history less frequently
  });

  return {
    current,
    history,
    isLoading: isLoadingCurrent || isLoadingHistory,
  };
}
