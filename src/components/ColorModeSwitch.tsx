import { Box, HStack, chakra } from "@chakra-ui/react";
import { useColorMode } from "./ui/color-mode";

const ToggleSwitch = chakra("button");

const ColorModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <HStack align="center">
      <ToggleSwitch
        type="button"
        role="switch"
        aria-label="Toggle dark mode"
        aria-checked={colorMode === "dark"}
        onClick={toggleColorMode}
        bg={colorMode === "dark" ? "blue.500" : "gray.300"}
        w="48px"
        h="26px"
        borderRadius="full"
        position="relative"
        border="none"
        cursor="pointer"
        transition="background-color 0.2s ease"
        padding="0"
      >
        <Box
          position="absolute"
          top="2px"
          left={colorMode === "dark" ? "24px" : "2px"}
          w="22px"
          h="22px"
          borderRadius="full"
          bg="white"
          boxShadow="md"
          transition="left 0.2s ease"
        />
      </ToggleSwitch>
    </HStack>
  );
};

export default ColorModeSwitch;
