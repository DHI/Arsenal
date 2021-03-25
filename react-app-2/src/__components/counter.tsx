import * as React from "react";
import { observer } from "mobx-react-lite";

export const Counter = observer<{
  counter: {
    count: number;
    incr(): any;
    decr(): any;
    setCount(v: number): any;
  };
}>(({ counter }) => {
  return (
    <>
      <p>Current count: [{counter.count}]</p>
      <p>
        <button onClick={counter.incr}>++</button>
        <button onClick={counter.decr}>--</button>
        <input
          onChange={(e) => counter.setCount(Number(e.target.value))}
          type="number"
          value={counter.count}
        />
      </p>
    </>
  );
});
