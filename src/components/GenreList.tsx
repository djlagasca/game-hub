import {
  Box,
  Heading,
  HStack,
  Image,
  List,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useColorModeValue } from "./ui/color-mode";
import useGenres, { type RawgGenre } from "@/hooks/useGenres";

interface GenreListProps {
  selectedGenreId?: number | null;
  onSelect: (genre: RawgGenre | null) => void;
}

const GenreList = ({ selectedGenreId, onSelect }: GenreListProps) => {
  const { genres, isLoading, error } = useGenres();
  const itemBg = "transparent";
  const itemHover = useColorModeValue("gray.50", "gray.800");
  const imageBorder = useColorModeValue("gray.200", "whiteAlpha.200");
  const fallbackSwatch = "transparent";
  const textColor = useColorModeValue("gray.800", "gray.100");

  if (error)
    return (
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
    );

  return (
    <VStack align="stretch" gap={4} w="full">
      <Heading
        size="sm"
        textTransform="uppercase"
        color="gray.500"
        letterSpacing="0.2em"
      >
        Genres
      </Heading>

      <List.Root
        display="flex"
        flexDir="column"
        gap={0}
        m={0}
        listStyleType="none"
      >
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <List.Item key={index} m={0}>
                <Skeleton height="64px" borderRadius="lg" />
              </List.Item>
            ))
          : genres.map((genre) => {
              const isSelected = selectedGenreId === genre.id;
              return (
                <List.Item key={genre.id} m={0}>
                  <Box
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelect(isSelected ? null : genre)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSelect(isSelected ? null : genre);
                      }
                    }}
                    borderRadius="lg"
                    overflow="hidden"
                    position="relative"
                    minH="64px"
                    w="full"
                    bg={itemBg}
                    borderWidth={isSelected ? "2px" : "1px"}
                    borderColor={isSelected ? "blue.400" : "transparent"}
                    transition="transform 0.2s ease, border-color 0.2s ease"
                    cursor="pointer"
                    _hover={{ transform: "scale(1.01)", bg: itemHover }}
                  >
                    <HStack gap={3} align="center" w="full">
                      <Box
                        w="48px"
                        h="48px"
                        borderRadius="lg"
                        overflow="hidden"
                        borderWidth="1px"
                        borderColor={imageBorder}
                      >
                        {genre.image_background ? (
                          <Image
                            src={genre.image_background}
                            alt={genre.name}
                            w="full"
                            h="full"
                            objectFit="cover"
                          />
                        ) : (
                          <Box
                            w="full"
                            h="full"
                            bg={fallbackSwatch}
                            aria-hidden="true"
                          />
                        )}
                      </Box>
                      <VStack align="start" gap={0} flex="1">
                        <Text fontWeight="semibold" color={textColor}>
                          {genre.name}
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                </List.Item>
              );
            })}
      </List.Root>
    </VStack>
  );
};

export default GenreList;
