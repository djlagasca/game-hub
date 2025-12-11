import { useEffect, useState } from "react";
import apiClient from "@/services/api-client";

export interface RawgGame {
    id: number;
    name: string;
    background_image?: string;
    released?: string;
    metacritic?: number;
    rating?: number;
    parent_platforms?: {
        platform: {
        id: number;
        name: string;
        slug: string;
        };
    }[];
}

interface GamesResponse {
    results: RawgGame[];
}

export const DEFAULT_PAGE_SIZE = 12;

interface UseGameOptions {
  pageSize?: number;
  genreSlug?: string;
  searchQuery?: string;
}

const useGame = ({
  pageSize = DEFAULT_PAGE_SIZE,
  genreSlug,
  searchQuery,
}: UseGameOptions = {}) => {
  const [games, setGames] = useState<RawgGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setError(null);

    apiClient
      .get<GamesResponse>("/games", {
        params: {
          ordering: "-metacritic",
          page_size: pageSize,
          genres: genreSlug,
          search: searchQuery,
        },
        signal: controller.signal,
      })
      .then((response) => {
        setGames(response.data.results);
      })
      .catch((fetchError) => {
        if (fetchError instanceof Error && fetchError.name === "CanceledError") {
          return;
        }
        setError("Unable to fetch games right now. Please try again later.");
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [pageSize, genreSlug, searchQuery]);

  return { games, isLoading, error };
};

export default useGame;
