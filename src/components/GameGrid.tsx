import {
  Box,
  Button,
  SimpleGrid,
  Stack,
  Text,
  chakra,
  useBreakpointValue,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import useGame, { DEFAULT_PAGE_SIZE, type RawgGame } from "@/hooks/useGame";
import usePlatforms, { type RawgParentPlatform } from "@/hooks/usePlatforms";
import GameCard from "./GameCard";
import GameCardSkeleton from "./GameCardSkeleton";
import { useColorModeValue } from "./ui/color-mode";

const pulse = keyframes`
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
`;

interface GameGridProps {
  genreSlug?: string;
  searchQuery?: string;
}

const PlatformSelect = chakra("select");

interface PlatformFilterProps {
  selectedPlatform: RawgParentPlatform | null;
  onSelect: (platform: RawgParentPlatform | null) => void;
  platforms: RawgParentPlatform[];
  isDisabled?: boolean;
}

const PlatformFilter = ({
  selectedPlatform,
  onSelect,
  platforms,
  isDisabled = false,
}: PlatformFilterProps) => {
  const selectValue = selectedPlatform?.id.toString() ?? "";
  const selectBg = useColorModeValue("white", "gray.900");
  const selectBorder = useColorModeValue("gray.200", "gray.700");

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const platform = platforms.find(
      ({ id }) => id.toString() === event.target.value
    );
    onSelect(platform ?? null);
  };

  return (
    <Stack gap={2} w="full">
      <PlatformSelect
        value={selectValue}
        onChange={handleChange}
        disabled={isDisabled}
        bg={selectBg}
        borderColor={selectBorder}
        borderRadius="lg"
        borderWidth="1px"
        alignSelf="flex-start"
        w={{ base: "100%", sm: "280px" }}
        px={4}
        py={3}
        fontWeight="medium"
        cursor="pointer"
      >
        <option value="">All platforms</option>
        {platforms.map((platform) => (
          <option key={platform.id} value={platform.id}>
            {platform.name}
          </option>
        ))}
      </PlatformSelect>
    </Stack>
  );
};

interface SortOption {
  label: string;
  value: string;
}

const SORT_OPTIONS: SortOption[] = [
  { label: "Relevance", value: "" },
  { label: "Release date", value: "-released" },
  { label: "Name A-Z", value: "name" },
  { label: "Name Z-A", value: "-name" },
  { label: "Metacritic", value: "-metacritic" },
  { label: "Rating", value: "-rating" },
];

interface SortSelectorProps {
  ordering: string;
  onChange: (value: string) => void;
}

const SortSelector = ({ ordering, onChange }: SortSelectorProps) => (
  <Stack gap={2} w="full">
    <PlatformSelect
      value={ordering}
      onChange={(event) => onChange(event.target.value)}
      bg={useColorModeValue("white", "gray.900")}
      borderColor={useColorModeValue("gray.200", "gray.700")}
      borderRadius="lg"
      borderWidth="1px"
      alignSelf="flex-start"
      w={{ base: "100%", sm: "240px" }}
      px={4}
      py={3}
      fontWeight="medium"
      cursor="pointer"
    >
      {SORT_OPTIONS.map((option) => (
        <option key={option.value || "relevance"} value={option.value}>
          Order by: {option.label}
        </option>
      ))}
    </PlatformSelect>
  </Stack>
);

const GameGrid = ({ genreSlug, searchQuery }: GameGridProps) => {
  const [selectedPlatform, setSelectedPlatform] =
    useState<RawgParentPlatform | null>(null);
  const [ordering, setOrdering] = useState("");
  const [page, setPage] = useState(1);
  const [displayedGames, setDisplayedGames] = useState<RawgGame[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const {
    platforms,
    isLoading: arePlatformsLoading,
    error: platformError,
  } = usePlatforms();
  const { games, isLoading, error } = useGame({
    genreSlug,
    searchQuery,
    platformId: selectedPlatform?.id,
    page,
    ordering,
  });
  const columns = useBreakpointValue({ base: 1, sm: 2, lg: 3, xl: 5 }) ?? 1;

  const cardBorder = useColorModeValue("gray.100", "gray.800");

  const skeletonCount = Math.max(DEFAULT_PAGE_SIZE, columns * 3);
  const skeletons = useMemo(
    () => Array.from({ length: skeletonCount }),
    [skeletonCount]
  );
  const estimatedRows = Math.ceil(skeletonCount / columns);
  const isInitialLoading =
    isLoading && page === 1 && displayedGames.length === 0;
  const showSkeletons = isInitialLoading;
  const gridMinHeight = showSkeletons ? `${estimatedRows * 260}px` : undefined;

  useEffect(() => {
    setPage(1);
    setDisplayedGames([]);
    setHasMore(true);
  }, [genreSlug, searchQuery, selectedPlatform, ordering]);

  useEffect(() => {
    if (isLoading) return;
    setDisplayedGames((prev) => {
      if (page === 1) {
        return games;
      }
      const existingIds = new Set(prev.map((game) => game.id));
      const nextBatch = games.filter((game) => !existingIds.has(game.id));
      return [...prev, ...nextBatch];
    });
    if (games.length < DEFAULT_PAGE_SIZE) {
      setHasMore(false);
    }
  }, [games, isLoading, page]);

  useEffect(() => {
    if (selectedPlatform) return;
    const sentinel = loadMoreRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isLoading && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [selectedPlatform, isLoading, hasMore]);

  const filterBg = useColorModeValue("white", "gray.900");
  const filterShadow = useColorModeValue("sm", "md");
  const filterStickyTop =
    useBreakpointValue({ base: "64px", md: "72px" }) ?? "64px";

  return (
    <Stack gap={6}>
      <Box
        position="sticky"
        top={filterStickyTop}
        zIndex={5}
        bg={filterBg}
        boxShadow={filterShadow}
        borderRadius="xl"
        py={3}
        px={{ base: 3, md: 4 }}
      >
        <Stack
          gap={{ base: 3, md: 4 }}
          direction={{ base: "column", md: "row" }}
          align={{ base: "stretch", md: "center" }}
          justify="space-between"
        >
          <Stack gap={3} direction={{ base: "column", md: "row" }} flex="1">
            <PlatformFilter
              selectedPlatform={selectedPlatform}
              onSelect={setSelectedPlatform}
              platforms={platforms}
              isDisabled={arePlatformsLoading || !!platformError}
            />
            {selectedPlatform && (
              <Button
                variant="ghost"
                size="sm"
                alignSelf={{ base: "flex-start", md: "center" }}
                onClick={() => setSelectedPlatform(null)}
              >
                Clear platform filter
              </Button>
            )}
          </Stack>
          <SortSelector ordering={ordering} onChange={setOrdering} />
        </Stack>
      </Box>

      {arePlatformsLoading && (
        <Text color="gray.500" fontSize="sm">
          Loading platform list...
        </Text>
      )}
      {platformError && (
        <Text color="red.500" fontSize="sm">
          {platformError}
        </Text>
      )}

      {error && (
        <Box
          borderRadius="lg"
          borderWidth="1px"
          borderColor="red.300"
          bg="red.50"
          color="red.700"
          px={4}
          py={3}
        >
          {error}
        </Box>
      )}

      <SimpleGrid
        columns={{ base: 1, sm: 2, lg: 3, xl: 5 }}
        gap={{ base: 4, md: 6 }}
        w="full"
        minH={gridMinHeight}
      >
        {showSkeletons
          ? skeletons.map((_, index) => (
              <GameCardSkeleton
                key={`skeleton-${index}`}
                borderColor={cardBorder}
                animation={`${pulse} 1.6s ease-in-out ${
                  index * 0.08
                }s infinite`}
              />
            ))
          : displayedGames.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
      </SimpleGrid>

      {!selectedPlatform && (
        <Box
          ref={loadMoreRef}
          w="full"
          py={4}
          textAlign="center"
          color="gray.500"
        >
          {isLoading && page > 1
            ? "Loading more games..."
            : hasMore
            ? "Scroll to load more releases"
            : "You’ve reached the end of the feed."}
        </Box>
      )}
    </Stack>
  );
};

export default GameGrid;
