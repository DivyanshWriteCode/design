"use client";

import { ClientSideSuspense } from "@liveblocks/react";

import { CommentsOverlay } from "@/components/comments/commentsOverlay";

export const Comments = () => (
  <ClientSideSuspense fallback={null}>
    {() => <CommentsOverlay />}
  </ClientSideSuspense>
);
