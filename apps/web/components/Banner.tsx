import { BANNER } from "@/lib/banner";

/** Título visual "NICO SKILLS" em pixel-art. O h1 real fica na página, em texto. */
export function Banner() {
  const { width, height, cells } = BANNER;
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full max-w-3xl text-accent"
      fill="currentColor"
      shapeRendering="crispEdges"
    >
      {cells.map(({ x, y }) => (
        <rect key={`${x}-${y}`} x={x + 0.06} y={y + 0.06} width={0.88} height={0.88} />
      ))}
    </svg>
  );
}
