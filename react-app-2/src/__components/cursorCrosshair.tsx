import { observer } from "mobx-react-lite";
import * as React from "react";
import tw, { css } from "twin.macro";

export type ICursorPosition = {
  x: number;
  y: number;
  latitude?: number;
  longitude?: number;
};

export const CursorCrosshair = observer<{
  position: undefined | ICursorPosition;
}>(({ position }) => {
  if (!position) return <></>;

  const { x, y, latitude, longitude } = position;

  const horLine = (
    <div
      tw="absolute w-full left-0 top-2/4"
      css={css`
        border-top: 4px solid #3aa5d688;
      `}
    />
  );

  const vertLine = (
    <div
      css={css`
        ${tw`absolute h-full`}
        top: 0;
        left: 50%;
        border-left: 4px solid #6bdb8d88;
      `}
    />
  );

  const center = (
    <div tw="absolute left-2/4 top-2/4">
      <div
        tw="m-2 text-xs flex"
        css={css`
          background: #fff5;

          P {
            margin: 4px;
          }
        `}
      >
        <p>{latitude?.toFixed(6)}</p>
        <p>{longitude?.toFixed(6)}</p>
      </div>
    </div>
  );

  return (
    <>
      <main
        tw="fixed w-full h-full"
        css={css`
          left: -100%;
          top: -100%;
          width: 200%;
          height: 200%;
          pointer-events: none;
        `}
      >
        <div
          tw="relative w-full h-full"
          style={{
            top: `${y}px`,
            left: `${x}px`,
            pointerEvents: "none",
          }}
        >
          {horLine}
          {vertLine}
          {center}
        </div>
      </main>
    </>
  );
});
