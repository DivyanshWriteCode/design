import { LiveMap, createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  throttle: 16,
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!,
});

type Presence = {
  // cursor: { x: number, y: number } | null,
  // ...
};

type Storage = {
  // author: LiveObject<{ firstName: string, lastName: string }>,
  // ...
  canvasObjects: LiveMap<string, any>;
};

type UserMeta = {
  // id?: string,  // Accessible through `user.id`
  // info?: Json,  // Accessible through `user.info`
};

type RoomEvent = {
  // type: "NOTIFICATION",
  // ...
};

export type ThreadMetadata = {
  resolved: boolean;
  zIndex: number;
  time?: number;
  x: number;
  y: number;
};

export const {
  RoomProvider,
  useRoom,
  useMyPresence,
  useUpdateMyPresence,
  useSelf,
  useOthers,
  useOthersMapped,
  useOthersConnectionIds,
  useOther,
  useBroadcastEvent,
  useEventListener,
  useErrorListener,
  useStorage,
  useBatch,
  useHistory,
  useUndo,
  useRedo,
  useCanUndo,
  useCanRedo,
  useMutation,
  useStatus,
  useLostConnectionListener,
  useThreads,
  useUser,
  useCreateThread,
  useEditThreadMetadata,
  useCreateComment,
  useEditComment,
  useDeleteComment,
  useAddReaction,
  useRemoveReaction,
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent, ThreadMetadata>(client,);
