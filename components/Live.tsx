import { useMyPresence, useOthers } from '@/liveblocks.config';
import LiveCursor from './cursor/LiveCursors';
import { useCallback, useEffect, useState } from 'react';
import CursorChat from './cursor/CursorChat';
import { CursorMode, CursorState, Reaction } from '@/types/type';
import { useBroadcastEvent, useEventListener } from '@liveblocks/react';
import ReactionSelector from './Reaction/ReactionButton';
import useInterval from '@/hooks/useInterval';

type Props = {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
}

const Live = ({ canvasRef }: Props) => {
  const others = useOthers();
  const [{ cursor }, updateMyPresence] = useMyPresence() as any;
  const broadcast = useBroadcastEvent();

  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  });

  const [reactions, setReactions] = useState<Reaction[]>([]);

  // Remove old reactions every second
  useInterval(() => {
    setReactions((reactions) => reactions.filter((reaction) => reaction.timestamp > Date.now() - 4000));
  }, 1000);

  // Broadcast new reactions every 100ms
  useInterval(() => {
    if (cursorState.mode === CursorMode.Reaction && cursorState.isPressed && cursor) {
      setReactions((reactions) =>
        reactions.concat([
          {
            point: { x: cursor.x, y: cursor.y },
            value: cursorState.reaction,
            timestamp: Date.now(),
          },
        ])
      );
      broadcast({
        x: cursor.x,
        y: cursor.y,
        value: cursorState.reaction,
      });
    }
  }, 100);

  // Listen for reactions from other users
  useEventListener(({ event }) => {
    const reactionEvent = event as Reaction;
    setReactions((reactions) =>
      reactions.concat([
        {
          point: { x: reactionEvent.x, y: reactionEvent.y },
          value: reactionEvent.value,
          timestamp: Date.now(),
        },
      ])
    );
  });

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (cursor == null || cursorState.mode !== CursorMode.ReactionSelector) {
        const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

        updateMyPresence({ cursor: { x, y } });

        setCursorState((state: CursorState) =>
          cursorState.mode === CursorMode.Reaction ? { ...state, isPressed: true } : state
        );
      }
    },
    [cursor, cursorState.mode, updateMyPresence]
  );

  const handlePointerLeave = useCallback(() => {
    setCursorState({ mode: CursorMode.Hidden });
    updateMyPresence({ cursor: null, message: null });
  }, [updateMyPresence]);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
      const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
      updateMyPresence({ cursor: { x, y } });

      setCursorState((state: CursorState) =>
        cursorState.mode === CursorMode.Reaction ? { ...state, isPressed: true } : state
      );
    },
    [cursorState.mode, updateMyPresence]
  );

  const handlePointerUp = useCallback(() => {
    setCursorState((state: CursorState) =>
      cursorState.mode === CursorMode.Reaction ? { ...state, isPressed: false } : state
    );
  }, [cursorState.mode]);

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === '/') {
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: '',
        });
      } else if (e.key === 'Escape') {
        updateMyPresence({ message: '' });
        setCursorState({ mode: CursorMode.Hidden });
      } else if (e.key === 'e') {
        setCursorState({ mode: CursorMode.ReactionSelector });
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        e.preventDefault();
      }
    };

    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [updateMyPresence]);

  return (
    <div
      id="canvas"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="h-[100vh] w-full flex justify-center items-center text-center bg-[#1B222D]"
    >



      <canvas ref={canvasRef} />



      {cursor && (
        <CursorChat
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      )}

      {cursorState.mode === CursorMode.ReactionSelector && (
        <ReactionSelector
          setReaction={(reaction) => {
            setCursorState({ mode: CursorMode.Reaction, reaction, isPressed: false });
          }}
        />
      )}

      {reactions.map((reaction, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            left: reaction.point.x,
            top: reaction.point.y,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        >
          {reaction.value}
        </div>
      ))}

      <LiveCursor others={others} />
    </div>
  );
};

export default Live;
