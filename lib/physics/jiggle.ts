/**
 * Pure physics maths for the Akatsuki Bottle Jiggle Engine.
 * Units: degrees, px/ms, frames. Frame-rate independent semi-implicit Euler integration.
 */

export const SWING_STRENGTH = 1.0; // Tune jiggle strength here (1.0 = gentle natural swing)

export const SWING_LIMIT = 5.5; // Max swing angle: 4 to 6 degrees
export const SWING_DAMP = 5.5;
export const SWING_K = 28;
export const COUPLE = 0.015;

export const JIGGLE_CONFIG = {
  // Angular spring-damper (natural gentle swing: settles in ~1.0s)
  K_ANGLE: 0.24,
  C_ANGLE: 0.14,
  MAX_ANGLE: 5.5, // deg clamp
  SWING_LIMIT: 5.5,
  SWING_DAMP: 5.5,
  SWING_K: 28,
  COUPLE: 0.015,
  SWING_STRENGTH,

  // Squash & stretch spring-damper
  K_SQUASH: 0.30,
  C_SQUASH: 0.15,
  MAX_SQUASH: 0.04, // signed clamp

  // Liquid slosh
  MAX_SLOSH_AMP: 0.4,
  SLOSH_DECAY: 0.90,
  SLOSH_FREQ: 0.15,

  // Traveling wave across rail
  WAVE_SPEED_THRESHOLD: 0.8, // px/ms
  WAVE_DELAY_PER_HOP_MS: 50, // ms
  WAVE_ATTENUATION_PER_HOP: 0.5,
  NEIGHBOUR_COUPLING: 0.015,

  // Pointer dead-zone and EMA smoothing
  POINTER_DEAD_ZONE: 0.02, // px/ms
  POINTER_CLAMP_V: 1.5, // px/ms
  POINTER_EMA_ALPHA: 0.25,
  POINTER_IDLE_DECAY: 0.9,

  // Spatial influence radiuses
  INFLUENCE_RADIUS: 180, // px
  DIRECT_HIT_RADIUS: 60, // px
} as const;

export function clamp(val: number, min: number, max: number): number {
  if (Number.isNaN(val)) return 0;
  return Math.max(min, Math.min(max, val));
}

/**
 * Normalizes frame delta to 60fps equivalent step f = min(delta, 50) / 16.667.
 */
export function calculateFrameStep(deltaMs: number): number {
  if (Number.isNaN(deltaMs) || deltaMs <= 0) return 1.0;
  return Math.min(deltaMs, 50) / 16.667;
}

/**
 * Semi-implicit Euler integration for angle (degrees).
 */
export function integrateAngle(
  angle: number,
  angVel: number,
  impulse: number,
  f: number,
  targetAngle: number = 0
): { angle: number; angVel: number } {
  let nextAngVel =
    angVel +
    (-JIGGLE_CONFIG.K_ANGLE * (angle - targetAngle) - JIGGLE_CONFIG.C_ANGLE * angVel + impulse * SWING_STRENGTH) * f;
  if (Number.isNaN(nextAngVel)) nextAngVel = 0;

  let nextAngle = angle + nextAngVel * f;
  if (Number.isNaN(nextAngle)) nextAngle = 0;

  // Clamp dynamic swing to ±MAX_ANGLE around the target resting angle
  nextAngle = clamp(
    nextAngle,
    targetAngle - JIGGLE_CONFIG.MAX_ANGLE,
    targetAngle + JIGGLE_CONFIG.MAX_ANGLE
  );

  return { angle: nextAngle, angVel: nextAngVel };
}

/**
 * Semi-implicit Euler integration for squash (-0.12 .. 0.12).
 */
export function integrateSquash(
  squash: number,
  squashVel: number,
  squashImpulse: number,
  f: number
): { squash: number; squashVel: number } {
  let nextSquashVel =
    squashVel +
    (-JIGGLE_CONFIG.K_SQUASH * squash - JIGGLE_CONFIG.C_SQUASH * squashVel + squashImpulse) * f;
  if (Number.isNaN(nextSquashVel)) nextSquashVel = 0;

  let nextSquash = squash + nextSquashVel * f;
  if (Number.isNaN(nextSquash)) nextSquash = 0;

  nextSquash = clamp(nextSquash, -JIGGLE_CONFIG.MAX_SQUASH, JIGGLE_CONFIG.MAX_SQUASH);

  return { squash: nextSquash, squashVel: nextSquashVel };
}

/**
 * Updates liquid slosh phase and decay.
 */
export function integrateSlosh(
  phase: number,
  amp: number,
  f: number
): { phase: number; amp: number } {
  const nextPhase = (phase + JIGGLE_CONFIG.SLOSH_FREQ * f) % (Math.PI * 2);
  const nextAmp = clamp(amp * Math.pow(JIGGLE_CONFIG.SLOSH_DECAY, f), 0, JIGGLE_CONFIG.MAX_SLOSH_AMP);
  return { phase: nextPhase, amp: nextAmp };
}

/**
 * Computes neighbour coupling forces on snapshot of angles:
 * impulse += 0.06 * (a[i-1] + a[i+1] - 2 * a[i]), where edges mirror own angle.
 */
export function calculateNeighbourCoupling(angles: number[]): number[] {
  const n = angles.length;
  if (n <= 1) return angles.map(() => 0);

  const couplings = new Array<number>(n);
  for (let i = 0; i < n; i++) {
    const left = i === 0 ? angles[0] : angles[i - 1];
    const right = i === n - 1 ? angles[n - 1] : angles[i + 1];
    couplings[i] = JIGGLE_CONFIG.NEIGHBOUR_COUPLING * (left + right - 2 * angles[i]);
  }
  return couplings;
}

/**
 * Computes smoothed pointer velocity (px/ms) via Exponential Moving Average (EMA).
 */
export function updatePointerVelocity(
  prevV: number,
  rawV: number,
  isIdle: boolean
): number {
  if (isIdle) {
    const decayed = prevV * JIGGLE_CONFIG.POINTER_IDLE_DECAY;
    return Math.abs(decayed) < 0.001 ? 0 : decayed;
  }
  const clampedRaw = clamp(rawV, -JIGGLE_CONFIG.POINTER_CLAMP_V, JIGGLE_CONFIG.POINTER_CLAMP_V);
  const ema = (1 - JIGGLE_CONFIG.POINTER_EMA_ALPHA) * prevV + JIGGLE_CONFIG.POINTER_EMA_ALPHA * clampedRaw;
  if (Math.abs(ema) < JIGGLE_CONFIG.POINTER_DEAD_ZONE) {
    return 0;
  }
  return clamp(ema, -JIGGLE_CONFIG.POINTER_CLAMP_V, JIGGLE_CONFIG.POINTER_CLAMP_V);
}
