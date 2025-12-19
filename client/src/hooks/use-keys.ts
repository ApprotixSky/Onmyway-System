import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useKeys() {
  return useQuery({
    queryKey: [api.keys.list.path],
    queryFn: async () => {
      const res = await fetch(api.keys.list.path);
      if (!res.ok) throw new Error("Failed to fetch keys");
      return api.keys.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateKey() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (label: string) => {
      const res = await fetch(api.keys.create.path, {
        method: api.keys.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label }),
      });
      if (!res.ok) throw new Error("Failed to create key");
      return api.keys.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.keys.list.path] });
      toast({
        title: "Key Generated",
        description: "API key created successfully.",
        className: "border-primary/50 text-primary",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate key.",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteKey() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.keys.delete.path, { id });
      const res = await fetch(url, { method: api.keys.delete.method });
      if (!res.ok) throw new Error("Failed to delete key");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.keys.list.path] });
      toast({
        title: "Key Revoked",
        description: "API key has been deleted.",
      });
    },
  });
}
