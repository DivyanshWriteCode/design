"use client";

import React, { useEffect, useRef, useState } from 'react';
import Live from "@/components/Live";
import { LiveblocksProvider, RoomProvider, useStorage, useMutation } from "@liveblocks/react";
import { createClient } from "@liveblocks/client";
import Navbar from '@/components/Navbar';
import RightSidebar from '@/components/RightSidebar';
import LeftSidebar from '@/components/LeftSidebar';
import { fabric } from "fabric";
import { handleCanvasMouseDown, handleCanvaseMouseMove, handleCanvasMouseUp, handleResize, initializeFabric } from '@/lib/canvas';
import { ActiveElement } from '@/types/type';

// Ensure the environment variable is correctly set
const publicApiKey = process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY || "pk_prod_WpnTx60i0uIYT21gDU408xJ6LZVFMh48bAkzg_y-35dKBNGQzgKoYA96n0BAR7qx";

if (!publicApiKey) {
  console.error("Public API Key for Liveblocks is not set. Please check your environment variables.");
  throw new Error("Public API Key for Liveblocks is not set. Please check your environment variables.");
}

// Log the public API key to ensure it's being set correctly
console.log("Liveblocks publicApiKey:", publicApiKey);

// Create the Liveblocks client
const client = createClient({
  publicApiKey
});

const ROOM_ID = "my-room";

// CanvasComponent to encapsulate canvas-related logic
function CanvasComponent({ canvasRef, fabricRef, isDrawing, shapeRef, selectedShapeRef, syncShapeInStorage }) {
  useEffect(() => {
    // Initialize Fabric canvas
    const canvas = initializeFabric({ canvasRef, fabricRef });

    const handleMouseDown = (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef
      });
    };

    const handleMouseMove = (options) => {
      handleCanvaseMouseMove({
        options,
        canvas,
        isDrawing,
        shapeRef
      });
    };

    const handleMouseUp = (options) => {
      handleCanvasMouseUp({
        options,
        canvas,
        isDrawing,
        shapeRef,
        syncShapeInStorage
      });
    };

    const handleWindowResize = () => {
      handleResize({ fabricRef });
    };

    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);

    window.addEventListener("resize", handleWindowResize);

    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:up", handleMouseUp);
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [syncShapeInStorage]);

  return <Live canvasRef={canvasRef} />;
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef(false);
  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string | null>('circle');
  const activeObjectRef  = useRef<fabric.Object | null>(null);

  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: "",
    value: "",
    icon: "",
  });

  const handleActiveElement = (elem: ActiveElement) => {
    setActiveElement(elem);
    selectedShapeRef.current = elem?.value as string;
  };

  return (
    <LiveblocksProvider client={client}>
      <RoomProvider id={ROOM_ID}>
        <Content
          canvasRef={canvasRef}
          fabricRef={fabricRef}
          isDrawing={isDrawing}
          shapeRef={shapeRef}
          selectedShapeRef={selectedShapeRef}
          activeElement={activeElement}
          handleActiveElement={handleActiveElement}
        />
      </RoomProvider>
    </LiveblocksProvider>
  );
}

function Content({ canvasRef, fabricRef, isDrawing, shapeRef, selectedShapeRef, activeElement, handleActiveElement }) {
  const canvasObjects = useStorage((root) => root.canvasObjects);

  const syncShapeInStorage = useMutation(({ storage }, object) => {
    if (!object) return;
    const { objectId } = object;

    const shapeData = object.toJSON();
    shapeData.objectId = objectId;

    storage.canvasObjects.set(objectId, shapeData);
  }, [canvasObjects]);

  return (
    <main className='h-screen overflow-hidden'>
      <Navbar
        activeElement={activeElement}
        handleActiveElement={handleActiveElement}
      />
      <section className='flex h-full flex-row'>
        <LeftSidebar />
        <CanvasComponent
          canvasRef={canvasRef}
          fabricRef={fabricRef}
          isDrawing={isDrawing}
          shapeRef={shapeRef}
          selectedShapeRef={selectedShapeRef}
          syncShapeInStorage={syncShapeInStorage}
        />
        <RightSidebar />
      </section>
    </main>
  );
}
