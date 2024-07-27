import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type AvatarProps = {
  name: string;
  otherStyles?: string;
};

const Avatar = ({ name, otherStyles }: AvatarProps) => {
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    setAvatarUrl(`https://liveblocks.io/avatars/avatar-${Math.floor(Math.random() * 30)}.png`);
  }, []);

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className={`relative h-9 w-9 rounded-full ${otherStyles}`} data-tooltip={name}>
          <Image
            src={avatarUrl}
            layout="fill"
            className="rounded-full"
            alt={name}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent className="border-none bg-primary-grey-200 px-2.5 py-1.5 text-xs">
        {name}
      </TooltipContent>
    </Tooltip>
  );
};

export default Avatar;
