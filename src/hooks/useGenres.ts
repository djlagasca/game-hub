import { useEffect, useState } from "react";
import apiClient from "@/services/api-client";

export interface RawgGenre {
  id: number;
  name: string;
  slug: string;
  games_count?: number;
  image_background?: string;
}

interface GenresResponse {
  results: RawgGenre[];
}

const useGenres = () => {
  const [genres, setGenres] = useState<RawgGenre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    apiClient
      .get<GenresResponse>("/genres", { signal: controller.signal })
      .then((response) => {
        setGenres(response.data.results);
      })
      .catch((fetchError) => {
        if (fetchError instanceof Error && fetchError.name === "CanceledError") {
          return;
        }
        setError("Unable to fetch genres right now. Please try again later.");
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { genres, isLoading, error };
};

export default useGenres;
