import { Box, type BoxProps } from "@chakra-ui/react";
import { useColorModeValue } from "./ui/color-mode";

interface GameCardContainerProps extends BoxProps {
  animation?: string;
}

const GameCardContainer = ({
  animation,
  bg,
  borderColor,
  children,
  ...rest
}: GameCardContainerProps) => {
  const cardBg = useColorModeValue("white", "gray.900");
  const cardBorder = useColorModeValue("gray.100", "gray.800");

  return (
    <Box
      borderRadius="2xl"
      overflow="hidden"
      borderWidth="1px"
      boxShadow="lg"
      transition="transform 0.2s ease, box-shadow 0.2s ease"
      display="flex"
      flexDir="column"
      h="100%"
      animation={animation}
      bg={bg ?? cardBg}
      borderColor={borderColor ?? cardBorder}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default GameCardContainer;
