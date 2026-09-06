import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { WorkItem } from "@/domain/types";
import { workItemRepository } from "@/services/work-item-repository";

const KEY = ["work-items"] as const;

export function useWorkItems() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => workItemRepository.list(),
    staleTime: 0,
  });
}

export function useSaveWorkItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (item: WorkItem) => workItemRepository.save(item),
    onSuccess: () => void qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteWorkItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => workItemRepository.remove(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useClearWorkItems() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => workItemRepository.clear(),
    onSuccess: () => void qc.invalidateQueries({ queryKey: KEY }),
  });
}
