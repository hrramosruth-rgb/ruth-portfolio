"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { LAND_POINTS } from "./land-points";

const MADRID = { lat: 40.42, lon: -3.7 };
const DEG = Math.PI / 180;
const SPIN = 0.06; // degrees per frame while idle
const IDLE_TILT = 22; // lean the north pole toward the viewer

export type GlobeHandle = {
  /** Turn the globe so Madrid faces the viewer. */
  focusHome: () => void;
  /** Resume the idle spin. */
  release: () => void;
};

/**
 * An Earth-blue globe with dotted continents (orthographic projection on a canvas). It turns slowly,
 * keeps a green marker on Madrid, and can ease round to face Madrid on request.
 */
export const Globe = forwardRef<GlobeHandle, { className?: string }>(function Globe({ className }, ref) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const state = useRef({ lon: -40, lat: IDLE_TILT, target: null as null | { lon: number; lat: number }, visible: true });

  useImperativeHandle(ref, () => ({
    focusHome: () => {
      // Madrid to the front, sitting a little above centre.
      state.current.target = { lon: -MADRID.lon, lat: MADRID.lat - 10 };
    },
    release: () => {
      state.current.target = null;
    },
  }));

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    const still = prefersReducedMotion();
    const s = state.current;
    let raf = 0;
    let size = 0;
    let dpr = 1;
    let t = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = el.clientWidth;
      el.width = Math.round(size * dpr);
      el.height = Math.round(size * dpr);
    };

    const draw = () => {
      const r = (size / 2) * 0.86;
      const c = size / 2;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      // Atmosphere halo.
      const halo = ctx.createRadialGradient(c, c, r * 0.9, c, c, r * 1.16);
      halo.addColorStop(0, "rgba(110, 170, 255, 0.28)");
      halo.addColorStop(1, "rgba(110, 170, 255, 0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(c, c, r * 1.16, 0, Math.PI * 2);
      ctx.fill();

      // Ocean sphere: lit from the upper left, falling into night on the far side.
      const body = ctx.createRadialGradient(c - r * 0.38, c - r * 0.42, r * 0.08, c, c, r);
      body.addColorStop(0, "#3d7fb8");
      body.addColorStop(0.5, "#174a78");
      body.addColorStop(1, "#06172a");
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(c, c, r, 0, Math.PI * 2);
      ctx.fill();

      // Continents: dots on the near hemisphere, fading toward the limb.
      const lam = s.lon * DEG;
      const phi = s.lat * DEG;
      const cosPhi = Math.cos(phi);
      const sinPhi = Math.sin(phi);
      const dot = Math.max(1, r / 150);
      for (let i = 0; i < LAND_POINTS.length; i += 2) {
        const la = (LAND_POINTS[i] as number) * DEG;
        const lo = (LAND_POINTS[i + 1] as number) * DEG + lam;
        const cosLa = Math.cos(la);
        const x = cosLa * Math.sin(lo);
        const y0 = Math.sin(la);
        const z0 = cosLa * Math.cos(lo);
        const y = y0 * cosPhi - z0 * sinPhi;
        const z = y0 * sinPhi + z0 * cosPhi;
        if (z <= 0) continue;
        ctx.globalAlpha = 0.2 + 0.8 * z;
        ctx.fillStyle = "#e4efdc";
        ctx.fillRect(c + x * r - dot / 2, c - y * r - dot / 2, dot, dot);
      }
      ctx.globalAlpha = 1;

      // Madrid marker with a soft pulse.
      {
        const la = MADRID.lat * DEG;
        const lo = MADRID.lon * DEG + lam;
        const cosLa = Math.cos(la);
        const x = cosLa * Math.sin(lo);
        const y0 = Math.sin(la);
        const z0 = cosLa * Math.cos(lo);
        const y = y0 * cosPhi - z0 * sinPhi;
        const z = y0 * sinPhi + z0 * cosPhi;
        if (z > 0) {
          const px = c + x * r;
          const py = c - y * r;
          const pulse = (t % 120) / 120;
          ctx.strokeStyle = `rgba(61, 220, 132, ${0.7 * (1 - pulse) * z})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(px, py, dot * 3 + pulse * dot * 9, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = `rgba(61, 220, 132, ${z})`;
          ctx.beginPath();
          ctx.arc(px, py, dot * 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Specular rim.
      const rim = ctx.createRadialGradient(c, c, r * 0.82, c, c, r);
      rim.addColorStop(0, "rgba(255, 255, 255, 0)");
      rim.addColorStop(1, "rgba(170, 210, 255, 0.35)");
      ctx.fillStyle = rim;
      ctx.beginPath();
      ctx.arc(c, c, r, 0, Math.PI * 2);
      ctx.fill();
    };

    const loop = () => {
      if (s.visible) {
        t += 1;
        if (s.target) {
          const dLon = ((((s.target.lon - s.lon) % 360) + 540) % 360) - 180;
          s.lon += dLon * 0.06;
          s.lat += (s.target.lat - s.lat) * 0.06;
        } else if (!still) {
          s.lon += SPIN;
          s.lat += (IDLE_TILT - s.lat) * 0.02;
        }
        draw();
      }
      raf = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(([entry]) => {
      s.visible = entry?.isIntersecting ?? true;
    });
    const sizer = new ResizeObserver(() => {
      resize();
      draw();
    });
    observer.observe(el);
    sizer.observe(el);
    resize();
    draw();
    raf = requestAnimationFrame(loop);
    return () => {
      observer.disconnect();
      sizer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvas} className={className} aria-hidden="true" />;
});
