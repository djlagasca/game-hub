import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  chakra,
  useBreakpointValue,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { type ChangeEvent, useMemo, useState } from "react";
import useGame, { DEFAULT_PAGE_SIZE } from "@/hooks/useGame";
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
}

const PlatformFilter = ({
  selectedPlatform,
  onSelect,
}: PlatformFilterProps) => {
  const { platforms, isLoading, error } = usePlatforms();
  const helperColor = useColorModeValue("gray.600", "gray.400");
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
      <Stack gap={0}>
        <Heading size="lg">Platform filter</Heading>
        <Text color={helperColor} fontSize="sm">
          Dial in RAWG results to a specific ecosystem.
        </Text>
      </Stack>
      <PlatformSelect
        value={selectValue}
        onChange={handleChange}
        disabled={!!error || isLoading}
        bg={selectBg}
        borderColor={selectBorder}
        borderRadius="lg"
        borderWidth="1px"
        alignSelf="flex-start"
        w={{ base: "100%", sm: "280px" }}
        px={4}
        py={3}
        fontWeight="medium"
      >
        <option value="">All platforms</option>
        {platforms.map((platform) => (
          <option key={platform.id} value={platform.id}>
            {platform.name}
          </option>
        ))}
      </PlatformSelect>
      {isLoading && (
        <Text color="gray.500" fontSize="sm">
          Loading platform list...
        </Text>
      )}
      {error && (
        <Text color="red.500" fontSize="sm">
          {error}
        </Text>
      )}
    </Stack>
  );
};

const GameGrid = ({ genreSlug, searchQuery }: GameGridProps) => {
  const [selectedPlatform, setSelectedPlatform] =
    useState<RawgParentPlatform | null>(null);
  const { games, isLoading, error } = useGame({
    genreSlug,
    searchQuery,
    platformId: selectedPlatform?.id,
  });
  const columns = useBreakpointValue({ base: 1, sm: 2, lg: 3, xl: 5 }) ?? 1;

  const cardBorder = useColorModeValue("gray.100", "gray.800");

  const skeletons = useMemo(
    () => Array.from({ length: DEFAULT_PAGE_SIZE }),
    []
  );
  const estimatedRows = Math.ceil(DEFAULT_PAGE_SIZE / columns);
  const showSkeletons = isLoading || games.length === 0;
  const gridMinHeight = showSkeletons ? `${estimatedRows * 260}px` : undefined;

  return (
    <Stack gap={6}>
      <PlatformFilter
        selectedPlatform={selectedPlatform}
        onSelect={setSelectedPlatform}
      />

      {selectedPlatform && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedPlatform(null)}
        >
          Clear platform filter
        </Button>
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
          : games.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
      </SimpleGrid>
    </Stack>
  );
};

export default GameGrid;
