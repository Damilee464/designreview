import { useState } from "react";

const BUBBLES = [
  { cls: "bubble-1" },
  { cls: "bubble-2" },
  { cls: "bubble-3" },
  { cls: "bubble-4" },
  { cls: "bubble-5" },
  { cls: "bubble-6" },
  { cls: "bubble-7" },
  { cls: "bubble-8" },
  { cls: "bubble-9" },
  { cls: "bubble-10" },
  { cls: "bubble-11" },
  { cls: "bubble-12" },
];

function Bubble({ cls }: { cls: string }) {
  const [bursting, setBursting] = useState(false);
  const [gone, setGone] = useState(false);

  function handleClick() {
    if (bursting || gone) return;
    setBursting(true);
    setTimeout(() => setGone(true), 400);
    // Respawn after 8 seconds
    setTimeout(() => { setGone(false); setBursting(false); }, 8000);
  }

  if (gone) return null;

  return (
    <div
      className={`bubble ${cls} ${bursting ? "bubble-burst" : ""}`}
      onClick={handleClick}
      style={{ cursor: "pointer", pointerEvents: "auto" }}
      aria-hidden="true"
    />
  );
}

export function BlobBackground() {
  return (
    <div aria-hidden="true">
      {BUBBLES.map((b) => (
        <Bubble key={b.cls} cls={b.cls} />
      ))}
    </div>
  );
}
