import { HStack, Icon } from "@chakra-ui/react";
import type { IconType } from "react-icons";
import {
  FaAndroid,
  FaApple,
  FaLinux,
  FaPlaystation,
  FaSteam,
  FaWindows,
  FaXbox,
} from "react-icons/fa";
import type { RawgGame } from "@/hooks/useGame";
import { Tooltip } from "./ui/tooltip";

const PLATFORM_ICON_MAP: Record<string, IconType> = {
  pc: FaWindows,
  playstation: FaPlaystation,
  xbox: FaXbox,
  ios: FaApple,
  android: FaAndroid,
  linux: FaLinux,
  mac: FaApple,
  nintendo: FaXbox,
  web: FaSteam,
};

interface PlatformIconListProps {
  platforms?: RawgGame["parent_platforms"];
}

const PlatformIconList = ({ platforms }: PlatformIconListProps) => {
  if (!platforms?.length) return null;

  return (
    <HStack gap={2} align="center" minH="32px">
      {platforms.map(({ platform }) => {
        const IconComponent = PLATFORM_ICON_MAP[platform.slug];
        if (!IconComponent) return null;

        return (
          <Tooltip
            key={platform.id}
            content={platform.name}
            openDelay={150}
            showArrow
          >
            <Icon as={IconComponent} color="gray.500" boxSize={6} />
          </Tooltip>
        );
      })}
    </HStack>
  );
};

export default PlatformIconList;
