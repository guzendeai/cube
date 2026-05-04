'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import type { CategoryId, CategoryMeta } from '@/types';
import { CATEGORIES } from '@/data/siteData';
import CategoryPanel from '@/components/CategoryPanel';

// ─── Phase state machine ──────────────────────────────────────────────────────
// idle → attract (hover / touchstart)
// attract → frame  (click / touchend sequence)
// frame   → open   (after frame animation)
// open    → idle   (on close)
type Phase = 'idle' | 'attract' | 'frame' | 'open';

// ─── Positions ────────────────────────────────────────────────────────────────
const DESKTOP_POS: Record<CategoryId, { left: string; top: string }> = {
  kotoba: { left: '20%', top: '27%' },
  aruki:  { left: '62%', top: '21%' },
  asobi:  { left: '13%', top: '58%' },
  note:   { left: '70%', top: '48%' },
  yohaku: { left: '36%', top: '73%' },
  nagi:   { left: '67%', top: '75%' },
};

const MOBILE_POS: Record<CategoryId, { left: string; top: string }> = {
  kotoba: { left: '24%', top: '20%' },
  aruki:  { left: '68%', top: '29%' },
  asobi:  { left: '20%', top: '48%' },
  note:   { left: '70%', top: '55%' },
  yohaku: { left: '26%', top: '73%' },
  nagi:   { left: '68%', top: '78%' },
};

// ─── Dot type ─────────────────────────────────────────────────────────────────
type Dot = {
  x: number; y: number;
  vx: number; vy: number;
  targetX: number; targetY: number;
  radius: number;
  baseOpacity: number;
  currentOpacity: number;
  gathering: boolean;
};

const DOT_COUNT   = 88;
const GATHER_COUNT = 24;

function createDots(w: number, h: number): Dot[] {
  return Array.from({ length: DOT_COUNT }, () => {
    const speed = 0.05 + Math.random() * 0.12;
    const angle = Math.random() * Math.PI * 2;
    const x = Math.random() * w;
    const y = Math.random() * h;
    const opacity = 0.1 + Math.random() * 0.28;
    return {
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      targetX: x, targetY: y,
      radius: 0.8 + Math.random() * 1.5,
      baseOpacity: opacity, currentOpacity: opacity,
      gathering: false,
    };
  });
}

// Positions distributed along the panel border rectangle
function framePositions(
  px: number, py: number, pw: number, ph: number, count: number
): Array<{ x: number; y: number }> {
  const pts: Array<{ x: number; y: number }> = [];
  const perim = 2 * (pw + ph);
  for (let i = 0; i < count; i++) {
    const t = ((i + 0.5) / count) * perim;
    let x: number, y: number;
    if      (t < pw)           { x = px + t;              y = py; }
    else if (t < pw + ph)      { x = px + pw;             y = py + (t - pw); }
    else if (t < 2 * pw + ph)  { x = px + pw - (t-pw-ph); y = py + ph; }
    else                       { x = px;                  y = py + ph - (t-2*pw-ph); }
    pts.push({ x, y });
  }
  return pts;
}

// ─── CategoryLabel ────────────────────────────────────────────────────────────
type LabelProps = {
  category: CategoryMeta;
  position: { left: string; top: string };
  isHighlighted: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  onTouchStart: () => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  registerRef: (el: HTMLElement | null) => void;
};

function CategoryLabel({
  category, position, isHighlighted,
  onMouseEnter, onMouseLeave, onClick, onTouchStart, onTouchEnd, registerRef,
}: LabelProps) {
  return (
    <div
      ref={registerRef}
      role="button"
      tabIndex={0}
      aria-label={category.label}
      style={{
        position: 'absolute',
        left: position.left,
        top: position.top,
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer',
        userSelect: 'none',
        fontFamily: 'var(--font-serif-jp), "Noto Serif JP", serif',
        fontSize: 'clamp(15px, 2.4vw, 18px)',
        fontWeight: 300,
        letterSpacing: '0.14em',
        color: isHighlighted ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.44)',
        textShadow: isHighlighted
          ? '0 0 20px rgba(180,210,255,0.45), 0 0 44px rgba(180,210,255,0.2)'
          : 'none',
        transition: 'color 0.38s ease, text-shadow 0.38s ease',
        padding: '12px 16px',
        zIndex: 10,
        minWidth: '44px',
        minHeight: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    >
      {category.label}
    </div>
  );
}

// ─── HomePage ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const dotsRef       = useRef<Dot[]>([]);
  const labelRefsMap  = useRef<Map<CategoryId, HTMLElement | null>>(new Map());
  const phaseRef      = useRef<Phase>('idle');
  const activeCatRef  = useRef<CategoryId | null>(null);
  const seqTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [phase, setPhase]               = useState<Phase>('idle');
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const [isMobile, setIsMobile]         = useState(false);
  const [mounted, setMounted]           = useState(false);

  // ── Canvas + animation loop ───────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      setIsMobile(window.innerWidth < 768);
    };
    resize();
    dotsRef.current = createDots(canvas.width, canvas.height);
    window.addEventListener('resize', resize);
    setMounted(true);

    let animId: number;
    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Faster lerp during frame phase so dots reach panel border quickly
      const p    = phaseRef.current;
      const lerp = (p === 'frame' || p === 'open') ? 0.10 : 0.05;

      for (const dot of dotsRef.current) {
        if (dot.gathering) {
          dot.x += (dot.targetX - dot.x) * lerp;
          dot.y += (dot.targetY - dot.y) * lerp;
          dot.currentOpacity += (0.68 - dot.currentOpacity) * 0.05;
        } else {
          dot.x += dot.vx;
          dot.y += dot.vy;
          if (dot.x < 0) dot.vx = Math.abs(dot.vx);
          else if (dot.x > w) dot.vx = -Math.abs(dot.vx);
          if (dot.y < 0) dot.vy = Math.abs(dot.vy);
          else if (dot.y > h) dot.vy = -Math.abs(dot.vy);
          dot.currentOpacity += (dot.baseOpacity - dot.currentOpacity) * 0.025;
        }
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(188,210,240,${dot.currentOpacity})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // ── Phase helpers ─────────────────────────────────────────────────────────
  const setPhaseSync = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  const clearTimer = useCallback(() => {
    if (seqTimerRef.current) { clearTimeout(seqTimerRef.current); seqTimerRef.current = null; }
  }, []);

  const scatter = useCallback(() => {
    dotsRef.current.forEach(d => { d.gathering = false; });
  }, []);

  // Move GATHER_COUNT dots toward the label centre
  const doGather = useCallback((id: CategoryId) => {
    const el = labelRefsMap.current.get(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;

    const sorted = dotsRef.current
      .map((d, i) => ({ i, dist: Math.hypot(d.x - cx, d.y - cy) }))
      .sort((a, b) => a.dist - b.dist);

    dotsRef.current.forEach(d => { d.gathering = false; });
    sorted.slice(0, GATHER_COUNT).forEach(({ i }, idx) => {
      const angle = (idx / GATHER_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const r     = 26 + Math.floor(idx / 8) * 18 + Math.random() * 10;
      dotsRef.current[i].gathering = true;
      dotsRef.current[i].targetX   = cx + Math.cos(angle) * r;
      dotsRef.current[i].targetY   = cy + Math.sin(angle) * r;
    });
  }, []);

  // Move gathered dots to positions along the panel border
  const doFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const vw = canvas.width;
    const vh = canvas.height;
    const pw = Math.min(480, vw - 32);
    const ph = Math.min(Math.round(vh * 0.76), 580);
    const px = (vw - pw) / 2;
    const py = (vh - ph) / 2;

    const pts = framePositions(px, py, pw, ph, GATHER_COUNT);
    dotsRef.current
      .filter(d => d.gathering)
      .forEach((dot, i) => {
        dot.targetX = pts[i % pts.length].x;
        dot.targetY = pts[i % pts.length].y;
      });
  }, []);

  // ── Full interaction sequence ──────────────────────────────────────────────
  // attractMs: how long to show the attract animation before proceeding
  const beginSequence = useCallback((id: CategoryId, attractMs: number) => {
    clearTimer();
    scatter();
    activeCatRef.current = id;
    setActiveCategory(id);
    setPhaseSync('attract');
    doGather(id);

    seqTimerRef.current = setTimeout(() => {
      if (phaseRef.current !== 'attract' || activeCatRef.current !== id) return;
      setPhaseSync('frame');
      doFrame();

      seqTimerRef.current = setTimeout(() => {
        if (phaseRef.current !== 'frame' || activeCatRef.current !== id) return;
        setPhaseSync('open');
      }, 400);
    }, attractMs);
  }, [clearTimer, scatter, setPhaseSync, doGather, doFrame]);

  // ── Desktop handlers ──────────────────────────────────────────────────────
  const handleMouseEnter = useCallback((id: CategoryId) => {
    if (phaseRef.current !== 'idle') return;
    activeCatRef.current = id;
    setActiveCategory(id);
    setPhaseSync('attract');
    doGather(id);
  }, [setPhaseSync, doGather]);

  const handleMouseLeave = useCallback(() => {
    // Only cancel if still in attract (not yet clicked → not in frame/open)
    if (phaseRef.current !== 'attract') return;
    clearTimer();
    scatter();
    activeCatRef.current = null;
    setActiveCategory(null);
    setPhaseSync('idle');
  }, [clearTimer, scatter, setPhaseSync]);

  const handleClick = useCallback((id: CategoryId) => {
    if (phaseRef.current === 'attract' && activeCatRef.current === id) {
      // Already gathered from hover – proceed straight to frame
      clearTimer();
      setPhaseSync('frame');
      doFrame();
      seqTimerRef.current = setTimeout(() => {
        if (phaseRef.current !== 'frame') return;
        setPhaseSync('open');
      }, 400);
      return;
    }
    // Clicked without prior hover (keyboard, etc.)
    if (phaseRef.current === 'idle') {
      beginSequence(id, 480);
    }
  }, [clearTimer, setPhaseSync, doFrame, beginSequence]);

  // ── Mobile handlers ───────────────────────────────────────────────────────
  const handleTouchBegin = useCallback((id: CategoryId) => {
    if (phaseRef.current !== 'idle') return;
    // Start full sequence: dots gather (320ms) → frame (400ms) → open
    beginSequence(id, 320);
  }, [beginSequence]);

  // touchend only needs to prevent the browser's synthetic click event
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
  }, []);

  // ── Close ─────────────────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    clearTimer();
    scatter();
    activeCatRef.current = null;
    setActiveCategory(null);
    setPhaseSync('idle');
  }, [clearTimer, scatter, setPhaseSync]);

  const registerRef = useCallback((id: CategoryId, el: HTMLElement | null) => {
    labelRefsMap.current.set(id, el);
  }, []);

  const positions = isMobile ? MOBILE_POS : DESKTOP_POS;

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        background: 'linear-gradient(168deg, #060810 0%, #080c18 55%, #0a0e1c 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Atmospheric depth gradient */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 130% 45% at 50% 92%, rgba(20,26,52,0.55) 0%, transparent 65%),' +
            'radial-gradient(ellipse 70%  50% at 40% 40%, rgba(14,20,44,0.35) 0%, transparent 60%)',
        }}
      />

      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />

      {/* Category labels */}
      {mounted && CATEGORIES.map(cat => (
        <CategoryLabel
          key={cat.id}
          category={cat}
          position={positions[cat.id]}
          isHighlighted={activeCategory === cat.id}
          onMouseEnter={() => handleMouseEnter(cat.id)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(cat.id)}
          onTouchStart={() => handleTouchBegin(cat.id)}
          onTouchEnd={handleTouchEnd}
          registerRef={(el) => registerRef(cat.id, el)}
        />
      ))}

      {/* Panel — only rendered when dots have formed the frame (open phase) */}
      {phase === 'open' && activeCategory && (
        <CategoryPanel
          categoryId={activeCategory}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
