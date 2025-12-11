import { Skeleton, Stack } from "@chakra-ui/react";
import GameCardContainer from "./GameCardContainer";

interface GameCardSkeletonProps {
  borderColor: string;
  animation?: string;
  bg?: string;
}

const GameCardSkeleton = ({
  borderColor,
  animation,
  bg,
}: GameCardSkeletonProps) => (
  <GameCardContainer borderColor={borderColor} animation={animation} bg={bg}>
    <Skeleton h="180px" w="full" />
    <Stack gap={3} p={4} flex="1">
      <Skeleton h="20px" w="80%" />
      <Skeleton h="14px" w="60%" />
      <Skeleton h="14px" w="70%" />
    </Stack>
  </GameCardContainer>
);

export default GameCardSkeleton;
