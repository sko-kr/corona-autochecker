export function randomHumanDelay({ maxMs, minMs }: { maxMs: number; minMs: number } = { minMs: 600, maxMs: 2000 }) {
  return Math.round(Math.random() * (maxMs - minMs) + minMs)
}
