import { Badge } from "@chakra-ui/react";

interface CriticScoreProps {
  score?: number;
}

const CriticScore = ({ score }: CriticScoreProps) => {
  if (!score) return null;

  const colorScheme = score > 85 ? "green" : score > 70 ? "yellow" : "gray";

  return (
    <Badge
      bg={`${colorScheme}.600`}
      color="white"
      borderRadius="full"
      px={3}
      py={1}
      fontSize="md"
      textTransform="uppercase"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
    >
      {score}
    </Badge>
  );
};

export default CriticScore;
