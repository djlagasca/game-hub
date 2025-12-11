import { useState } from "react";
import type { RawgGenre } from "./useGenres";

const useGenreSelection = () => {
  const [selectedGenre, setSelectedGenre] = useState<RawgGenre | null>(null);

  return {
    selectedGenre,
    selectGenre: setSelectedGenre,
  };
};

export default useGenreSelection;
