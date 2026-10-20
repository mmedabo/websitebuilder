// Tiny mutable store shared by DOM sections and the WebGL orb.
// The render loop reads it every frame, so no React re-render is needed.
export const orb = {
  hue: 0.55,
  targetHue: 0.55,
  think: 0,
  targetThink: 0,
  pointer: { x: 0, y: 0 },
}

export function focusOrb(hue: number) {
  orb.targetHue = hue
  orb.targetThink = 1
}

export function releaseOrb() {
  orb.targetHue = 0.55
  orb.targetThink = 0
}
