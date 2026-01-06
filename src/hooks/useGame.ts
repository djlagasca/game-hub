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

export const DEFAULT_PAGE_SIZE = 10;

interface UseGameOptions {
  pageSize?: number;
  genreSlug?: string;
  searchQuery?: string;
  platformId?: number | null;
  page?: number;
  ordering?: string;
}

const useGame = ({
  pageSize = DEFAULT_PAGE_SIZE,
  genreSlug,
  searchQuery,
  platformId,
  page = 1,
  ordering,
}: UseGameOptions = {}) => {
  const [games, setGames] = useState<RawgGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setError(null);

    const orderingParam = ordering?.trim() ? ordering : undefined;

    apiClient
      .get<GamesResponse>("/games", {
        params: {
          ordering: orderingParam ?? "-metacritic",
          page_size: pageSize,
          page,
          genres: genreSlug,
          search: searchQuery,
          parent_platforms: platformId ?? undefined,
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
  }, [pageSize, page, genreSlug, searchQuery, platformId, ordering]);

  return { games, isLoading, error };
};

export default useGame;
