"use client";

import { useRef, useEffect, useCallback } from "react";
import { useReducedMotion } from "framer-motion";
import {
  JIGGLE_CONFIG,
  calculateFrameStep,
  integrateAngle,
  integrateSquash,
  integrateSlosh,
  calculateNeighbourCoupling,
  updatePointerVelocity,
  clamp,
} from "./jiggle";
import { restAngle } from "@/components/bottle-image";

export interface BottlePhysicsState {
  angle: number;
  angVel: number;
  squash: number;
  squashVel: number;
  sloshPhase: number;
  sloshAmp: number;
  impulse: number;
  squashImpulse: number;
  tagAngle: number;
  tagAngleHistory: [number, number]; // 2-frame lag ring
}

export interface QueuedWaveKick {
  targetBottleIdx: number;
  triggerTime: number;
  impulse: number;
  squashImpulse: number;
}

export interface UseJiggleEngineOptions {
  bottleCount: number;
  onFrameUpdate?: (states: BottlePhysicsState[]) => void;
}

export function useJiggleEngine(
  bottleRefs: React.RefObject<HTMLDivElement | null>[],
  tagRefs: React.RefObject<HTMLDivElement | null>[],
  sloshRefs?: React.RefObject<SVGPathElement | null>[]
) {
  const shouldReduceMotion = useReducedMotion();
  const bottleCount = bottleRefs.length;

  // Bottle physics states held in refs for 60fps performance without re-renders
  const statesRef = useRef<BottlePhysicsState[]>(
    Array.from({ length: bottleCount }, (_, idx) => ({
      angle: restAngle(idx),
      angVel: 0,
      squash: 0,
      squashVel: 0,
      sloshPhase: 0,
      sloshAmp: 0,
      impulse: 0,
      squashImpulse: 0,
      tagAngle: 0,
      tagAngleHistory: [0, 0],
    }))
  );

  // Traveling wave ring buffer
  const waveQueueRef = useRef<QueuedWaveKick[]>([]);

  // Pointer state
  const pointerStateRef = useRef({
    x: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    isOverRail: false,
    rect: null as DOMRect | null,
    bottleCenters: [] as number[],
  });

  // 90ms hover throttle timestamp
  const hoverThrottleRef = useRef<number>(0);

  // Intro and ambient sway lifecycle
  const introStateRef = useRef({
    introRunning: true,
    swayActive: false,
    startTime: 0,
    swayWeight: 0,
    interacted: false,
  });

  // First interaction permanently cancels intro & sway
  const cancelIntroAndSway = useCallback(() => {
    if (!introStateRef.current.interacted) {
      introStateRef.current.interacted = true;
      introStateRef.current.introRunning = false;
      introStateRef.current.swayActive = false;
      introStateRef.current.swayWeight = 0;
    }
  }, []);

  // Update cached bottle center positions
  const updateBottleGeometry = useCallback(() => {
    const centers: number[] = [];
    bottleRefs.forEach((ref) => {
      if (ref.current) {
        const bRect = ref.current.getBoundingClientRect();
        centers.push(bRect.left + bRect.width / 2);
      }
    });
    pointerStateRef.current.bottleCenters = centers;
  }, [bottleRefs]);

  // Pointer move handler on rail strip
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      cancelIntroAndSway();
      if (shouldReduceMotion) return;

      const p = pointerStateRef.current;
      const now = performance.now();
      const dt = Math.max(16, now - (p.lastTime || now));
      const rawV = (e.clientX - (p.lastX || e.clientX)) / dt;

      p.x = e.clientX;
      p.lastX = e.clientX;
      p.lastTime = now;
      p.isOverRail = true;
      p.velocity = updatePointerVelocity(p.velocity, rawV, false);

      const states = statesRef.current;
      const absV = Math.abs(p.velocity);

      // Deadband check: ignore microscopic subpixel jitter
      if (absV < 0.03) return;

      if (p.bottleCenters.length === 0) {
        updateBottleGeometry();
      }

      // Cursor movement gently drives swing (max 4 to 6 degrees)
      p.bottleCenters.forEach((center, idx) => {
        if (!states[idx]) return;
        const d = Math.abs(p.x - center);
        const infl = clamp(1 - d / JIGGLE_CONFIG.INFLUENCE_RADIUS, 0, 1);
        if (infl <= 0) return;

        // Neighboring bottles move slightly less via proximity influence
        const hoverNudge = clamp(p.velocity * 1.8 * infl, -2.8, 2.8);
        states[idx].impulse += hoverNudge;
        states[idx].squashImpulse += clamp(absV * 0.02 * infl, 0, 0.02);
      });
    },
    [cancelIntroAndSway, shouldReduceMotion, updateBottleGeometry]
  );

  const handlePointerLeave = useCallback(() => {
    pointerStateRef.current.isOverRail = false;
  }, []);

  // Tap impulse (Mobile / touch / Click)
  const triggerTapImpulse = useCallback(
    (idx: number, strength: number = 3.5) => {
      cancelIntroAndSway();
      if (shouldReduceMotion) return;
      const states = statesRef.current;
      if (states[idx]) {
        // Apply an alternating energetic pendulum kick on click/tap
        const direction = (states[idx].angVel <= 0 ? 1 : -1);
        states[idx].impulse += direction * strength;
        states[idx].squashImpulse += 0.04;
        states[idx].sloshAmp = 0.5;

        // Propagate subtle reactive wave to immediate neighbours
        if (states[idx - 1]) {
          states[idx - 1].impulse += direction * strength * 0.45;
          states[idx - 1].squashImpulse += 0.02;
        }
        if (states[idx + 1]) {
          states[idx + 1].impulse += direction * strength * 0.45;
          states[idx + 1].squashImpulse += 0.02;
        }
      }
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        try {
          navigator.vibrate(12);
        } catch {
          // Feature detect fail safe
        }
      }
    },
    [cancelIntroAndSway, shouldReduceMotion]
  );

  // Single Frame Loop (GPU-bound direct CSS transform execution)
  useEffect(() => {
    updateBottleGeometry();
    window.addEventListener("resize", updateBottleGeometry);

    let animationFrameId: number;
    let lastTime = performance.now();
    introStateRef.current.startTime = performance.now();

    const loop = (currentTime: number) => {
      const deltaMs = Math.max(1, currentTime - lastTime);
      lastTime = currentTime;
      const f = calculateFrameStep(deltaMs);

      const states = statesRef.current;
      const p = pointerStateRef.current;
      const intro = introStateRef.current;

      // Handle idle pointer velocity decay
      if (!p.isOverRail && Math.abs(p.velocity) > 0) {
        p.velocity = updatePointerVelocity(p.velocity, 0, true);
      }

      // Process traveling wave queue
      if (waveQueueRef.current.length > 0) {
        const remaining: QueuedWaveKick[] = [];
        for (const kick of waveQueueRef.current) {
          if (currentTime >= kick.triggerTime) {
            if (states[kick.targetBottleIdx]) {
              states[kick.targetBottleIdx].impulse += kick.impulse;
              states[kick.targetBottleIdx].squashImpulse += kick.squashImpulse;
            }
          } else {
            remaining.push(kick);
          }
        }
        waveQueueRef.current = remaining;
      }

      // Intro animation & ambient sway (if not yet interacted and motion allowed)
      if (!shouldReduceMotion && !intro.interacted) {
        const elapsed = (currentTime - intro.startTime) / 1000;
        if (elapsed < 2.0) {
          // Intro wave reduced to <= 2.5 deg (was ~8 deg)
          const introAngle =
            2.4 * Math.sin(elapsed * Math.PI * 1.5) * Math.exp(-elapsed * 1.6);
          if (states[0]) {
            states[0].angle = restAngle(0) + introAngle;
          }
        } else {
          // Ambient sway: calm gentle motion around resting angle
          intro.swayWeight = Math.min(1, intro.swayWeight + deltaMs / 400);
          const swayAngle = Math.sin(elapsed * 0.5) * 0.7 * intro.swayWeight;
          states.forEach((s, idx) => {
            s.angle = restAngle(idx) + swayAngle * Math.cos(idx * 0.5);
          });
        }
      }

      // Snapshot angles for order-independent neighbour coupling
      const angleSnapshot = states.map((s) => s.angle);
      const couplings = calculateNeighbourCoupling(angleSnapshot);

      // Integrate each bottle physics
      for (let i = 0; i < bottleCount; i++) {
        const s = states[i];
        if (!s) continue;

        if (shouldReduceMotion) {
          s.angle = restAngle(i);
          s.angVel = 0;
          s.squash = 0;
          s.squashVel = 0;
          s.sloshAmp = 0;
          s.tagAngle = 0;
          const bottleEl = bottleRefs[i]?.current;
          if (bottleEl) {
            bottleEl.style.transform = `rotate(${restAngle(i).toFixed(2)}deg)`;
          }
          const tagEl = tagRefs[i]?.current;
          if (tagEl) {
            tagEl.style.transform = `rotate(-8deg)`;
          }
          continue;
        }

        // Add neighbour coupling force
        const totalImpulse = s.impulse + couplings[i];

        // Integrate angle with target resting angle
        const nextAngleState = integrateAngle(s.angle, s.angVel, totalImpulse, f, restAngle(i));
        s.angle = nextAngleState.angle;
        s.angVel = nextAngleState.angVel;

        // Integrate squash
        const nextSquashState = integrateSquash(s.squash, s.squashVel, s.squashImpulse, f);
        s.squash = nextSquashState.squash;
        s.squashVel = nextSquashState.squashVel;

        // Reset impulses
        s.impulse = 0;
        s.squashImpulse = 0;

        // Update slosh
        const nextSlosh = integrateSlosh(s.sloshPhase, s.sloshAmp, f);
        s.sloshPhase = nextSlosh.phase;
        s.sloshAmp = nextSlosh.amp;

        // Secondary motion for tag: tag angle = angle * 1.25 with 2-frame lag
        const targetTagAngle = s.angle * 1.25;
        s.tagAngle = s.tagAngleHistory[0];
        s.tagAngleHistory[0] = s.tagAngleHistory[1];
        s.tagAngleHistory[1] = targetTagAngle;

        // Apply GPU transform directly to DOM elements for 60fps budget (<4ms)
        const bottleEl = bottleRefs[i]?.current;
        if (bottleEl) {
          const sy = 1 + s.squash;
          const sx = 1 - s.squash * 0.6;
          // transform-origin is at hook top-center
          bottleEl.style.transform = `rotate(${s.angle.toFixed(2)}deg) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`;
        }

        const tagEl = tagRefs[i]?.current;
        if (tagEl) {
          // Tag base rotate -8 deg + lagged tag angle
          tagEl.style.transform = `rotate(${(-8 + s.tagAngle).toFixed(2)}deg)`;
        }

        // Liquid slosh wave path
        const sloshEl = sloshRefs?.[i]?.current;
        if (sloshEl && s.sloshAmp > 0.01) {
          const waveHeight = s.sloshAmp * 15;
          const phaseOffset = Math.sin(s.sloshPhase) * waveHeight;
          sloshEl.setAttribute(
            "d",
            `M 0 ${60 + phaseOffset} Q 100 ${60 - phaseOffset}, 200 ${60 + phaseOffset} L 200 200 L 0 200 Z`
          );
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", updateBottleGeometry);
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    bottleCount,
    bottleRefs,
    tagRefs,
    sloshRefs,
    shouldReduceMotion,
    updateBottleGeometry,
  ]);

  return {
    handlePointerMove,
    handlePointerLeave,
    triggerTapImpulse,
    cancelIntroAndSway,
    statesRef,
  };
}

/**
 * Lighter jiggle hook (50% strength) for cards, quiz results, and ingredient tiles.
 */
export function useJiggle(ref: React.RefObject<HTMLElement | null>) {
  const shouldReduceMotion = useReducedMotion();
  const stateRef = useRef({
    angle: 0,
    angVel: 0,
    squash: 0,
    squashVel: 0,
  });

  useEffect(() => {
    const el = ref.current;
    if (!el || shouldReduceMotion) return;

    let animId: number;
    let lastTime = performance.now();

    const onPointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const dx = (e.clientX - centerX) / (rect.width / 2);
      // 50% lighter jiggle impulse
      stateRef.current.angVel += clamp(dx * 1.5, -4, 4);
      stateRef.current.squashVel += 0.02;
    };

    el.addEventListener("pointermove", onPointerMove);

    const loop = (time: number) => {
      const delta = Math.max(1, time - lastTime);
      lastTime = time;
      const f = calculateFrameStep(delta);
      const s = stateRef.current;

      const nextAngle = integrateAngle(s.angle, s.angVel, 0, f);
      s.angle = nextAngle.angle;
      s.angVel = nextAngle.angVel;

      const nextSquash = integrateSquash(s.squash, s.squashVel, 0, f);
      s.squash = nextSquash.squash;
      s.squashVel = nextSquash.squashVel;

      if (Math.abs(s.angle) > 0.01 || Math.abs(s.squash) > 0.005) {
        el.style.transform = `rotate(${s.angle.toFixed(2)}deg) scale(${1 - s.squash * 0.3}, ${1 + s.squash * 0.5})`;
      } else {
        el.style.transform = "";
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      el.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(animId);
      if (el) el.style.transform = "";
    };
  }, [ref, shouldReduceMotion]);
}
