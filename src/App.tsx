import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Grid, GridItem, useBreakpointValue } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import GenreList from "./components/GenreList";
import GameGrid from "./components/GameGrid";
import useGenreSelection from "./hooks/useGenreSelection";
import type { RawgGenre } from "./hooks/useGenres";
import { useColorModeValue } from "./components/ui/color-mode";
import "./App.css";

function App() {
  const appBg = useColorModeValue("gray.50", "gray.950");
  const textColor = useColorModeValue("gray.900", "gray.50");
  const { selectedGenre, selectGenre } = useGenreSelection();
  const [isNavSolid, setIsNavSolid] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollTimeoutRef = useRef<number | null>(null);
  const asideStickyTop = useBreakpointValue({ base: undefined, md: "96px" });

  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }

      if (window.scrollY > 0) {
        setIsNavSolid(true);
      } else {
        scrollTimeoutRef.current = window.setTimeout(() => {
          setIsNavSolid(false);
        }, 75);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleGenreSelect = useCallback(
    (genre: RawgGenre | null) => {
      selectGenre(genre);
      setSearchQuery("");
    },
    [selectGenre]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      if (value.trim().length > 0 && selectedGenre) {
        selectGenre(null);
      }
    },
    [selectGenre, selectedGenre]
  );

  return (
    <Box
      bg={appBg}
      color={textColor}
      minH="100vh"
      px={0}
      pt={0}
      pb={{ base: 4, md: 8 }}
      transition="background-color 0.2s ease"
      w="full"
    >
      <Grid
        gap={{ base: 4, md: 6 }}
        templateAreas={{
          base: `"nav" "main"`,
          md: `"nav nav" "aside main"`,
        }}
        templateColumns={{ base: "1fr", md: "260px 1fr" }}
        templateRows={{ base: "auto 1fr", md: "auto 1fr" }}
      >
        <GridItem area="nav" position="sticky" top={0} zIndex={20}>
          <NavBar
            isSolid={isNavSolid}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
        </GridItem>

        <GridItem
          area="aside"
          p={{ base: 4, md: 6 }}
          display={{ base: "none", md: "block" }}
        >
          <Box
            position="sticky"
            top={asideStickyTop}
            maxH="calc(100vh - 96px)"
            overflowY="auto"
            pr={2}
            css={{
              "&::-webkit-scrollbar": { width: "0px", height: "0px" },
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <GenreList
              selectedGenreId={selectedGenre?.id}
              onSelect={handleGenreSelect}
            />
          </Box>
        </GridItem>

        <GridItem
          area="main"
          pt={0}
          px={{ base: 4, md: 8 }}
          pb={{ base: 4, md: 8 }}
        >
          <GameGrid
            genreSlug={selectedGenre?.slug}
            genreName={selectedGenre?.name}
            searchQuery={searchQuery}
          />
        </GridItem>
      </Grid>
    </Box>
  );
}

export default App;
