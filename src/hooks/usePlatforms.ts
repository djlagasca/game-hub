import { useEffect, useState } from "react";
import apiClient from "@/services/api-client";

export interface RawgParentPlatform {
  id: number;
  name: string;
  slug: string;
}

interface PlatformsResponse {
  results: RawgParentPlatform[];
}

const usePlatforms = () => {
  const [platforms, setPlatforms] = useState<RawgParentPlatform[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setError(null);

    apiClient
      .get<PlatformsResponse>("/platforms/lists/parents", {
        signal: controller.signal,
      })
      .then((response) => {
        setPlatforms(response.data.results);
      })
      .catch((fetchError) => {
        if (fetchError instanceof Error && fetchError.name === "CanceledError") {
          return;
        }
        setError("Unable to load platforms. Please try again later.");
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { platforms, isLoading, error };
};

export default usePlatforms;
