export function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const a = ((deg - 90) * Math.PI) / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
}

export function wedge(cx: number, cy: number, r: number, s: number, e: number) {
  const [sx, sy] = polar(cx, cy, r, s)
  const [ex, ey] = polar(cx, cy, r, e)
  return `M${cx},${cy}L${sx},${sy}A${r},${r},0,${e - s > 180 ? 1 : 0},1,${ex},${ey}Z`
}
