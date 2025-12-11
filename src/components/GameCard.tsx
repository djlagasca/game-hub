import { Box, GridItem, Heading, HStack, Image, Stack } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import type { RawgGame } from "@/hooks/useGame";
import CriticScore from "./CriticScore";
import PlatformIconList from "./PlatformIconList";
import GameCardContainer from "./GameCardContainer";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

interface GameCardProps {
  game: RawgGame;
  index: number;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80";

const GameCard = ({ game, index }: GameCardProps) => (
  <GridItem h="full">
    <GameCardContainer
      _hover={{
        transform: "translateY(-8px) scale(1.01)",
        boxShadow: "2xl",
        borderColor: "blue.400",
      }}
      animation={`${fadeInUp} 0.5s ease ${index * 0.05}s both`}
      role="group"
      cursor="pointer"
      transform="scale(0.98)"
      transition="transform 0.35s ease, box-shadow 0.35s ease, border-color 0.2s ease"
    >
      <Box position="relative" h="180px" overflow="hidden">
        <Image
          src={game.background_image ?? FALLBACK_IMAGE}
          alt={game.name}
          objectFit="cover"
          objectPosition="center top"
          w="100%"
          h="100%"
          loading="lazy"
          transition="transform 0.45s ease"
          _groupHover={{ transform: "scale(1.08)" }}
        />
        <Box
          position="absolute"
          inset={0}
          bgGradient="linear(to-b, transparent, rgba(0,0,0,0.55))"
          opacity={0}
          transition="opacity 0.35s ease"
          _groupHover={{ opacity: 0.7 }}
        />
      </Box>

      <Stack
        gap={3}
        p={4}
        flex="1"
        justify="space-between"
        transition="transform 0.2s ease, filter 0.2s ease"
        _groupHover={{
          transform: "translateY(-2px)",
          filter: "brightness(1.05)",
        }}
      >
        <Heading
          size="xl"
          lineClamp={2}
          minH="52px"
          transition="color 0.2s ease"
          _groupHover={{ color: "blue.300" }}
        >
          {game.name}
        </Heading>

        <HStack
          w="full"
          gap={3}
          align="flex-end"
          justify="space-between"
          fontSize="sm"
          color="gray.500"
          minH="32px"
        >
          <Box flex="1" overflow="hidden">
            <PlatformIconList platforms={game.parent_platforms} />
          </Box>
          <Box flexShrink={0} alignSelf="flex-end">
            <CriticScore score={game.metacritic} />
          </Box>
        </HStack>
      </Stack>
    </GameCardContainer>
  </GridItem>
);

export default GameCard;
