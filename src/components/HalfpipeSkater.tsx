"use client";

import { useEffect, useRef } from "react";
import { SKATER_SAYS } from "@/content/spinner";

// The Halfpipe Skater (claude.ai artifact, 2026-11-13). Click or press Enter: he drops in, does a trick, says something rad.
// Lines and surfaces follow the page theme; the fills stay brand colors.

const W = 900, H = 520;
const BOTTOM = 470, R = 170, LW = 160, CX1 = LW + R, CX2 = W - LW - R, CY = BOTTOM - R, RW = CX2 + R;
const ARC = (Math.PI * R) / 2, FLAT = CX2 - CX1, TOTAL = ARC * 2 + FLAT;
const DECK_X = LW - 52, AIR = 160, SCALE = 1.25;
const T = { drop: 450, pass: 1350, air: 1250, back: 1350, out: 450 };
const TRICKS = ["kickflip", "spin", "varial", "grab"];
const BRAND = { cyan: "#03C0E8", teal: "#40E0D0", lilac: "#D3D3FF", gray: "#C4C4C4" };

type Pose = { x: number; y: number; r: number; idle?: boolean; bubble?: number; flip?: number; varial?: number; grab?: number };
type Run = { t0: number; trick: string; say: string; reduced: boolean };

const ease = (t: number) => (1 - Math.cos(Math.PI * t)) / 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (t: number) => Math.max(0, Math.min(1, t));

function rampPose(s: number): Pose {
  const d = clamp(s) * TOTAL;
  if (d <= ARC) { const th = Math.PI - d / R; return { x: CX1 + R * Math.cos(th), y: CY + R * Math.sin(th), r: th - Math.PI / 2 }; }
  if (d <= ARC + FLAT) return { x: CX1 + (d - ARC), y: BOTTOM, r: 0 };
  const th = Math.PI / 2 - (d - ARC - FLAT) / R;
  return { x: CX2 + R * Math.cos(th), y: CY + R * Math.sin(th), r: th - Math.PI / 2 };
}

export function HalfpipeSkater() {
  const ref = useRef<HTMLCanvasElement>(null);
  const run = useRef<Run | null>(null);
  const lastSay = useRef(-1);
  const lastTrick = useRef("");
  const lastText = useRef("");

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    let raf = 0, bubbleA = 0;
    let col = { ink: "#121318", paper: "#FFFBF4", ramp: "#F8F0E3" };
    const readTheme = () => {
      const css = getComputedStyle(document.documentElement);
      col = { ink: css.getPropertyValue("--text").trim(), paper: css.getPropertyValue("--surface").trim(), ramp: css.getPropertyValue("--surface-2").trim() };
    };
    readTheme();
    const mq = matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", readTheme);
    window.addEventListener("ub-theme", readTheme);

    const fit = () => { const d = Math.min(window.devicePixelRatio || 1, 2); cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    fit();
    window.addEventListener("resize", fit);

    const poseAt = (now: number): Pose => {
      const r = run.current;
      if (!r) return { x: DECK_X, y: CY, r: 0, idle: true };
      let t = now - r.t0;
      if (r.reduced) {
        if (t < 1800) return { x: RW - 6, y: CY - AIR * 0.9, r: 0, bubble: clamp(t / 150) };
        run.current = null; return { x: DECK_X, y: CY, r: 0, idle: true };
      }
      if (t < T.drop) { const k = ease(t / T.drop); return { x: lerp(DECK_X, LW, k), y: CY, r: lerp(0, Math.PI / 2, k) }; }
      t -= T.drop;
      if (t < T.pass) return rampPose(ease(t / T.pass));
      t -= T.pass;
      if (t < T.air) {
        const k = t / T.air, up = Math.sin(Math.PI * k);
        const p: Pose = { x: RW - 8 + 10 * up, y: CY - AIR * up, r: -Math.PI / 2 + (Math.PI / 2) * up, bubble: 1 };
        const mid = clamp((k - 0.2) / 0.6), em = ease(mid);
        if (r.trick === "spin") p.r -= Math.PI * 2 * em;
        if (r.trick === "kickflip") p.flip = Math.PI * 2 * em;
        if (r.trick === "varial") p.varial = Math.PI * 2 * em;
        if (r.trick === "grab") p.grab = Math.sin(Math.PI * mid);
        return p;
      }
      t -= T.air;
      if (t < T.back) return { ...rampPose(1 - ease(t / T.back)), bubble: t < 900 ? 1 : 0 };
      t -= T.back;
      if (t < T.out) { const k = ease(t / T.out); return { x: lerp(LW, DECK_X, k), y: CY, r: lerp(Math.PI / 2, 0, k) }; }
      run.current = null; return { x: DECK_X, y: CY, r: 0, idle: true };
    };

    const line = (pts: number[][]) => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke(); };

    const drawRamp = () => {
      ctx.fillStyle = col.paper; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = BRAND.gray; ctx.fillRect(0, 500, W, 20);
      ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 500); ctx.lineTo(W, 500); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(30, 500); ctx.lineTo(30, CY); ctx.lineTo(LW, CY);
      ctx.arc(CX1, CY, R, Math.PI, Math.PI / 2, true);
      ctx.lineTo(CX2, BOTTOM);
      ctx.arc(CX2, CY, R, Math.PI / 2, 0, true);
      ctx.lineTo(W - 30, CY); ctx.lineTo(W - 30, 500); ctx.closePath();
      ctx.fillStyle = col.ramp; ctx.fill();
      ctx.lineWidth = 4; ctx.strokeStyle = col.ink; ctx.stroke();
      ctx.lineWidth = 1.5; ctx.strokeStyle = BRAND.gray;
      for (const x of [80, 130, W - 130, W - 80]) { ctx.beginPath(); ctx.moveTo(x, CY + 6); ctx.lineTo(x, 496); ctx.stroke(); }
      ctx.beginPath(); ctx.moveTo(CX1 + FLAT / 2, BOTTOM + 4); ctx.lineTo(CX1 + FLAT / 2, 496); ctx.stroke();
      ctx.beginPath(); ctx.arc(CX1, CY, R - 7, Math.PI, Math.PI / 2, true); ctx.lineTo(CX2, BOTTOM - 7); ctx.arc(CX2, CY, R - 7, Math.PI / 2, 0, true);
      ctx.strokeStyle = BRAND.lilac; ctx.lineWidth = 5; ctx.stroke();
      ctx.fillStyle = BRAND.cyan; ctx.strokeStyle = col.ink; ctx.lineWidth = 3;
      for (const x of [LW, RW]) { ctx.beginPath(); ctx.arc(x, CY, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    };

    const drawSkater = (p: Pose, now: number) => {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.scale(SCALE, SCALE);
      const bob = p.idle ? Math.sin(now / 380) * 1.2 : 0;
      ctx.save(); ctx.translate(0, -7);
      if (p.varial) ctx.rotate(p.varial);
      if (p.flip) ctx.scale(1, Math.cos(p.flip) || 0.001);
      ctx.strokeStyle = col.ink; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.lineWidth = 4;
      line([[-31, -4], [-24, 0], [24, 0], [31, -4]]);
      ctx.fillStyle = BRAND.teal; ctx.lineWidth = 2;
      for (const x of [-16, 16]) { ctx.beginPath(); ctx.arc(x, 5, 3.6, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
      ctx.restore();
      const g = p.grab || 0;
      const hipY = -42 + g * 8 + bob, kneeY = -26 + g * 4;
      ctx.strokeStyle = col.ink; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.lineJoin = "round";
      line([[-11, -9], [-14 - g * 2, kneeY], [0, hipY]]);
      line([[11, -9], [14 + g * 2, kneeY], [0, hipY]]);
      const neckY = hipY - 28 + g * 4;
      line([[0, hipY], [0, neckY]]);
      const sh = neckY + 6;
      if (p.bubble && !g) line([[0, sh], [-18, sh - 10], [-26, sh - 26]]); else line([[0, sh], [-16, sh + 6], [-28, sh - 2]]);
      if (g) line([[0, sh], [12, sh + 16], [16, -9]]); else line([[0, sh], [16, sh + 4], [28, sh + 16]]);
      const hy = neckY - 11;
      ctx.fillStyle = col.paper; ctx.beginPath(); ctx.arc(0, hy, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      const spikes = [BRAND.cyan, BRAND.teal, BRAND.lilac, BRAND.cyan, BRAND.teal];
      ctx.lineWidth = 1.5;
      spikes.forEach((c, i) => {
        const a = -Math.PI / 2 + (i - 2) * 0.36, a0 = a - 0.2, a1 = a + 0.2, len = 15 + (i === 2 ? 6 : i % 2 ? 3 : 0);
        ctx.beginPath();
        ctx.moveTo(Math.cos(a0) * 11, hy + Math.sin(a0) * 11);
        ctx.lineTo(Math.cos(a) * (11 + len), hy + Math.sin(a) * (11 + len));
        ctx.lineTo(Math.cos(a1) * 11, hy + Math.sin(a1) * 11);
        ctx.closePath(); ctx.fillStyle = c; ctx.fill(); ctx.stroke();
      });
      ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(4, hy - 2, 1.6, 0, Math.PI * 2); ctx.fill();
      ctx.lineWidth = 1.8; ctx.beginPath(); ctx.arc(3, hy + 2, 4.5, 0.15 * Math.PI, 0.7 * Math.PI); ctx.stroke();
      ctx.restore();
    };

    const drawBubble = (text: string, alpha: number) => {
      if (!text || alpha <= 0) return;
      ctx.save(); ctx.globalAlpha = alpha;
      ctx.font = "800 26px Rubik, system-ui, sans-serif";
      const tw = ctx.measureText(text).width, pw = tw + 36, ph = 58;
      const x = Math.max(16, RW - 120 - pw), y = 30;
      ctx.fillStyle = col.paper; ctx.strokeStyle = col.ink; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.roundRect(x, y, pw, ph, 18); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + pw - 46, y + ph - 2); ctx.lineTo(x + pw + 6, y + ph + 30); ctx.lineTo(x + pw - 18, y + ph - 2); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillRect(x + pw - 44, y + ph - 4, 24, 5);
      ctx.fillStyle = col.ink; ctx.textBaseline = "middle"; ctx.fillText(text, x + 18, y + ph / 2 + 2);
      ctx.restore();
    };

    const frame = (now: number) => {
      const p = poseAt(now);
      drawRamp();
      drawSkater(p, now);
      bubbleA = p.bubble ? Math.min(1, bubbleA + 0.12) : Math.max(0, bubbleA - 0.08);
      drawBubble(run.current ? run.current.say : lastText.current, bubbleA);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
      window.removeEventListener("ub-theme", readTheme);
      mq.removeEventListener("change", readTheme);
    };
  }, []);

  function go() {
    if (run.current) return;
    let k;
    do k = Math.floor(Math.random() * SKATER_SAYS.length);
    while (k === lastSay.current);
    lastSay.current = k;
    lastText.current = SKATER_SAYS[k];
    let trick;
    do trick = TRICKS[Math.floor(Math.random() * TRICKS.length)];
    while (trick === lastTrick.current);
    lastTrick.current = trick;
    run.current = { t0: performance.now(), trick, say: SKATER_SAYS[k], reduced: matchMedia("(prefers-reduced-motion: reduce)").matches };
  }

  return (
    <div className="rounded-[22px] overflow-hidden sticker bg-surface">
      <canvas
        ref={ref}
        width={W}
        height={H}
        tabIndex={0}
        role="button"
        aria-label="Skater on a halfpipe. Click to make him drop in."
        onClick={go}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } }}
        className="block w-full h-auto cursor-pointer touch-manipulation"
      />
    </div>
  );
}
