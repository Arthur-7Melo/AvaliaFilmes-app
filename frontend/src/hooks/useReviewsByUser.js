import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

export default function useReviewsByUser() {
  return useQuery({
    queryKey: ["myReviews"],
    queryFn: async () => {
      const { data } = await api.get("/v1/me/reviews");
      return data.reviews;
    },
    staleTime: 1000 * 60 * 5,
  });
}