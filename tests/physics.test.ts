import { describe, it, expect } from "vitest";
import {
  JIGGLE_CONFIG,
  calculateFrameStep,
  integrateAngle,
  integrateSquash,
  integrateSlosh,
  calculateNeighbourCoupling,
  updatePointerVelocity,
  clamp,
} from "@/lib/physics/jiggle";

describe("Jiggle Physics Engine Unit Tests (§8 & §13)", () => {
  it("normalizes frame step delta cleanly with 50ms cap", () => {
    // 60fps (~16.667ms) should yield step close to 1.0
    const step60 = calculateFrameStep(16.667);
    expect(step60).toBeCloseTo(1.0, 2);

    // Delta of 50ms should cap at 50 / 16.667 = ~3.0
    const step50 = calculateFrameStep(50);
    expect(step50).toBeCloseTo(3.0, 1);

    // Delta exceeding 50ms (e.g. 100ms background tab) is capped at 50ms to prevent explosion
    const step100 = calculateFrameStep(100);
    expect(step100).toBeCloseTo(3.0, 1);
  });

  it("clamps angle to ±28 degrees with zero NaN", () => {
    // Test extreme positive impulse
    const highState = integrateAngle(25, 50, 100, 1.0);
    expect(highState.angle).toBe(28);
    expect(Number.isNaN(highState.angle)).toBe(false);
    expect(Number.isNaN(highState.angVel)).toBe(false);

    // Test extreme negative impulse
    const lowState = integrateAngle(-25, -50, -100, 1.0);
    expect(lowState.angle).toBe(-28);
    expect(Number.isNaN(lowState.angle)).toBe(false);
  });

  it("clamps squash to ±0.12 with zero NaN", () => {
    const highSquash = integrateSquash(0.1, 0.5, 1.0, 1.0);
    expect(highSquash.squash).toBe(0.12);
    expect(Number.isNaN(highSquash.squash)).toBe(false);

    const lowSquash = integrateSquash(-0.1, -0.5, -1.0, 1.0);
    expect(lowSquash.squash).toBe(-0.12);
    expect(Number.isNaN(lowSquash.squash)).toBe(false);
  });

  it("STABILITY TEST: underdamped spring settles (|angle| < 0.5° and |squash| < 0.01) within 3 seconds (<180 frames)", () => {
    // Start with max initial displacement 20 degrees
    let angle = 20;
    let angVel = 0;
    let squash = 0.1;
    let squashVel = 0;

    // Simulate 3 seconds at 60 fps (180 frames of 16.667 ms)
    for (let frame = 0; frame < 180; frame++) {
      const nextA = integrateAngle(angle, angVel, 0, 1.0);
      angle = nextA.angle;
      angVel = nextA.angVel;

      const nextS = integrateSquash(squash, squashVel, 0, 1.0);
      squash = nextS.squash;
      squashVel = nextS.squashVel;
    }

    // Must settle within limits
    expect(Math.abs(angle)).toBeLessThan(0.5);
    expect(Math.abs(squash)).toBeLessThan(0.01);
  });

  it("computes order-independent neighbour coupling correctly with mirrored edges", () => {
    const angles = [10, 5, 0, -5, -10];
    const couplings = calculateNeighbourCoupling(angles);

    expect(couplings).toHaveLength(5);
    // Bottle 0 left edge mirrors bottle 0: left=10, right=5, center=10 -> 0.06 * (10 + 5 - 20) = -0.30
    expect(couplings[0]).toBeCloseTo(0.06 * (10 + 5 - 20), 4);
    // Bottle 2: left=5, right=-5, center=0 -> 0.06 * (5 + -5 - 0) = 0
    expect(couplings[2]).toBeCloseTo(0, 4);
    // Bottle 4 right edge mirrors bottle 4: left=-5, right=-10, center=-10 -> 0.06 * (-5 + -10 - (-20)) = 0.30
    expect(couplings[4]).toBeCloseTo(0.06 * (-5 - 10 + 20), 4);
  });

  it("applies pointer dead-zone (<0.05 px/ms) and idle decay", () => {
    // Velocity below deadzone is suppressed to zero
    const driftV = updatePointerVelocity(0, 0.03, false);
    expect(driftV).toBe(0);

    // Fast pointer is clamped to ±3.0 px/ms
    const fastV = updatePointerVelocity(0, 10.0, false);
    expect(fastV).toBeLessThanOrEqual(JIGGLE_CONFIG.POINTER_CLAMP_V);

    // Idle decays by 0.9x
    const decayedV = updatePointerVelocity(1.0, 0, true);
    expect(decayedV).toBeCloseTo(0.9, 2);
  });
});
