import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";

export default function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/v1/reviews/${id}`),
    onSuccess: () => {
      qc.invalidateQueries(["myReviews"]);
    },
  });
}