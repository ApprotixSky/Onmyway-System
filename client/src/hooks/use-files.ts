import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useFiles(path: string = "/") {
  return useQuery({
    queryKey: [api.files.list.path, path],
    queryFn: async () => {
      const url = `${api.files.list.path}?path=${encodeURIComponent(path)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch files");
      return api.files.list.responses[200].parse(await res.json());
    },
  });
}

export function useFileContent(path: string | null) {
  return useQuery({
    queryKey: [api.files.read.path, path],
    queryFn: async () => {
      if (!path) return null;
      const url = `${api.files.read.path}?path=${encodeURIComponent(path)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to read file");
      return api.files.read.responses[200].parse(await res.json());
    },
    enabled: !!path,
  });
}
