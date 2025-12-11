import {
  Box,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useMemo } from "react";
import { FiTrendingUp } from "react-icons/fi";
import useGame, { DEFAULT_PAGE_SIZE } from "@/hooks/useGame";
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

const GameGrid = ({ genreSlug, searchQuery }: GameGridProps) => {
  const { games, isLoading, error } = useGame({ genreSlug, searchQuery });
  const columns = useBreakpointValue({ base: 1, sm: 2, lg: 3 }) ?? 1;

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
      <HStack gap={3} align="center">
        <Icon as={FiTrendingUp} boxSize={6} color="green.400" />
        <Stack gap={0}>
          <Heading size="lg">Trending now</Heading>
          <Text color="gray.500" fontSize="sm">
            Pulled live from RAWG — refreshed every visit.
          </Text>
        </Stack>
      </HStack>

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
        columns={{ base: 1, sm: 2, lg: 3 }}
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
