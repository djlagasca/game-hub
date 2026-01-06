import { HStack, Icon, Image, Input } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { ColorModeButton, useColorModeValue } from "./ui/color-mode";
import logoUrl from "@/assets/logo.webp";
import ColorModeSwitch from "./ColorModeSwitch";

type NavBarProps = {
  isSolid?: boolean;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
};

const NavBar = ({
  isSolid = false,
  searchQuery = "",
  onSearchChange,
}: NavBarProps) => {
  const panelBg = useColorModeValue("white", "gray.900");
  const panelShadow = useColorModeValue("lg", "dark-lg");
  const searchBg = useColorModeValue("gray.50", "gray.800");
  const searchBorder = useColorModeValue("gray.200", "gray.700");

  return (
    <HStack
      bg={isSolid ? panelBg : "transparent"}
      boxShadow={isSolid ? panelShadow : "none"}
      transition="box-shadow 0.10s ease-out"
      justify="space-between"
      gap={{ base: 4, md: 6 }}
      flexDir="row"
      align="center"
      flexWrap={{ base: "nowrap", lg: "wrap" }}
      w="full"
    >
      <HStack
        flex="1"
        gap={{ base: 3, md: 6 }}
        flexDir="row"
        flexWrap="wrap"
        align="center"
        minW={0}
        px={{ base: 4, md: 6 }}
        py={{ base: 3, md: 4 }}
      >
        <HStack align="center" gap={3}>
          <Image
            src={logoUrl}
            alt="Game Hub logo"
            boxSize="80px"
            borderRadius="full"
            objectFit="cover"
          />
        </HStack>

        <HStack
          flex="1"
          minW={{ base: "full", sm: "240px" }}
          maxW="560px"
          bg={searchBg}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={searchBorder}
          px={3}
          py={2}
          gap={3}
          display={{ base: "none", lg: "flex" }}
        >
          <Icon as={FiSearch} color="gray.400" boxSize={5} />
          <Input
            placeholder="Search games, studios, or tags"
            variant="subtle"
            size="sm"
            border="none"
            bg="transparent"
            h="26px"
            value={searchQuery}
            onChange={(event) => onSearchChange?.(event.target.value)}
            _placeholder={{ color: "gray.400" }}
            _focus={{
              boxShadow: "none",
              borderColor: "transparent",
              outline: "none",
            }}
            _focusVisible={{
              boxShadow: "none",
              borderColor: "transparent",
              outline: "none",
            }}
          />
        </HStack>
      </HStack>

      <HStack
        align="center"
        gap={-2}
        ml={{ base: 3, md: 0 }}
        px={{ base: 4, md: 6 }}
        py={{ base: 3, md: 4 }}
      >
        <ColorModeSwitch />
        <ColorModeButton size="md" />
      </HStack>
    </HStack>
  );
};

export default NavBar;
