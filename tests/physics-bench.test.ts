import { describe, it, expect } from "vitest";
import {
  calculateFrameStep,
  calculateNeighbourCoupling,
  integrateAngle,
  integrateSquash,
  integrateSlosh,
} from "@/lib/physics/jiggle";

describe("Jiggle Engine Performance Benchmark (§13.5)", () => {
  it("p95 frame time is strictly < 4ms for 5 bottles over 10,000 simulation frames", () => {
    const numBottles = 5;
    const numFrames = 10000;
    const frameTimes: number[] = [];

    // Initialize 5 bottle physics states
    const angles = [12, -8, 15, -10, 5];
    const angVels = [0.5, -0.2, 0.4, -0.3, 0.1];
    const squashes = [0, 0, 0, 0, 0];
    const squashVels = [0, 0, 0, 0, 0];
    const sloshPhases = [0, 0, 0, 0, 0];
    const sloshAmps = [0.8, 0.5, 0.9, 0.4, 0.6];

    for (let frame = 0; frame < numFrames; frame++) {
      const start = performance.now();
      const f = calculateFrameStep(16.667);
      const couplings = calculateNeighbourCoupling(angles);

      for (let i = 0; i < numBottles; i++) {
        const nextA = integrateAngle(angles[i], angVels[i], couplings[i], f);
        angles[i] = nextA.angle;
        angVels[i] = nextA.angVel;

        const nextS = integrateSquash(squashes[i], squashVels[i], 0, f);
        squashes[i] = nextS.squash;
        squashVels[i] = nextS.squashVel;

        const nextL = integrateSlosh(sloshPhases[i], sloshAmps[i], f);
        sloshPhases[i] = nextL.phase;
        sloshAmps[i] = nextL.amp;
      }
      const duration = performance.now() - start;
      frameTimes.push(duration);
    }

    // Sort to compute p95
    frameTimes.sort((a, b) => a - b);
    const p95Index = Math.floor(frameTimes.length * 0.95);
    const p95 = frameTimes[p95Index];
    const mean = frameTimes.reduce((acc, t) => acc + t, 0) / frameTimes.length;

    console.log(`[Jiggle Benchmark] 5 bottles × ${numFrames} frames: Mean=${mean.toFixed(6)}ms, p95=${p95.toFixed(6)}ms`);
    expect(p95).toBeLessThan(4.0);
  });
});
