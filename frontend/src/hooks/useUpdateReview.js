import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";

export default function useUpdateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, rating, content }) =>
      api.patch(`/v1/reviews/${id}`, { rating, content }),
    onSuccess: () => {
      qc.invalidateQueries(["myReviews"]);
    },
  });
}