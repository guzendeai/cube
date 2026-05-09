'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import type { CategoryId } from '@/types';
import { CATEGORIES } from '@/data/siteData';
import CategoryPanel from '@/components/CategoryPanel';
import { ParticleSystem, MOTIFS } from '@/lib/particles';

// ─── Stage machine ────────────────────────────────────────────────────────────
// forming   → formed      (5s after setMotif)
// formed    → dissolving  (user interaction OR 15s idle)
// dissolving→ forming     (if cycle < 3) | content (cycle === 3)
// content   → panel       (category clicked)
// panel     → content     (panel closed)
type Stage = 'forming' | 'formed' | 'dissolving' | 'content' | 'panel';

// ─── Category positions ───────────────────────────────────────────────────────
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

// ─── HomePage ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const canvasRef        = useRef<HTMLCanvasElement>(null);
  const sysRef           = useRef<ParticleSystem | null>(null);
  const stageRef         = useRef<Stage>('forming');
  const cycleRef         = useRef(0);            // 0–2; at 3 → content
  const isMobileRef      = useRef(false);
  const formTimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPointerRef   = useRef({ x: 0, y: 0, t: 0 });
  const selectedMotifsRef = useRef(
    [...MOTIFS].sort(() => Math.random() - 0.5).slice(0, 3)
  );

  const [stage, setStage]               = useState<Stage>('forming');
  const [labelsVisible, setLabelsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const [isMobile, setIsMobile]         = useState(false);

  const clearTimers = useCallback(() => {
    if (formTimerRef.current)  { clearTimeout(formTimerRef.current);  formTimerRef.current  = null; }
    if (idleTimerRef.current)  { clearTimeout(idleTimerRef.current);  idleTimerRef.current  = null; }
  }, []);

  const setStageSync = useCallback((s: Stage) => {
    stageRef.current = s;
    setStage(s);
  }, []);

  // ── Advance to next stage after dissolution completes ──────────────────────
  const onDissolveComplete = useCallback(() => {
    const nextCycle = cycleRef.current + 1;
    cycleRef.current = nextCycle;

    if (nextCycle < 3) {
      // Form next motif
      setStageSync('forming');
      sysRef.current?.setMotif(selectedMotifsRef.current[nextCycle]);
      formTimerRef.current = setTimeout(() => {
        if (stageRef.current !== 'forming') return;
        setStageSync('formed');
        idleTimerRef.current = setTimeout(() => triggerDissolveRef.current(), 15000);
      }, 5000);
    } else {
      // All 3 motifs done → form content clusters
      setStageSync('content');
      const mobile = isMobileRef.current;
      const pos = mobile ? MOBILE_POS : DESKTOP_POS;
      sysRef.current?.formClusters(
        CATEGORIES.map(cat => ({
          id: cat.id,
          x: parseFloat(pos[cat.id as CategoryId].left) / 100,
          y: parseFloat(pos[cat.id as CategoryId].top)  / 100,
          weight: 1,
        }))
      );
      // Labels fade in after particles have had time to cluster
      formTimerRef.current = setTimeout(() => setLabelsVisible(true), 3000);
    }
  }, [setStageSync]);

  // Store in ref so dissolution callback doesn't capture stale closure
  const triggerDissolveRef = useRef<() => void>(() => {});

  const triggerDissolve = useCallback(() => {
    if (stageRef.current !== 'formed' && stageRef.current !== 'forming') return;
    clearTimers();
    setStageSync('dissolving');
    sysRef.current?.dissolve(onDissolveComplete);
  }, [clearTimers, setStageSync, onDissolveComplete]);

  useEffect(() => {
    triggerDissolveRef.current = triggerDissolve;
  }, [triggerDissolve]);

  // ── Canvas + particle system setup ─────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mobile = window.innerWidth < 768;
    isMobileRef.current = mobile;
    setIsMobile(mobile);

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const sys = new ParticleSystem(canvas, mobile ? 1800 : 3200);
    sysRef.current = sys;
    sys.start();

    // Begin first motif
    sys.setMotif(selectedMotifsRef.current[0]);
    formTimerRef.current = setTimeout(() => {
      if (stageRef.current !== 'forming') return;
      setStageSync('formed');
      idleTimerRef.current = setTimeout(() => triggerDissolveRef.current(), 15000);
    }, 5500);

    const handleResize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      const m = window.innerWidth < 768;
      isMobileRef.current = m;
      setIsMobile(m);
      sys.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimers();
      sys.destroy();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Pointer interaction ────────────────────────────────────────────────────
  const handlePointerDown = useCallback((x: number, y: number) => {
    lastPointerRef.current = { x, y, t: Date.now() };
  }, []);

  const handlePointerMove = useCallback((x: number, y: number) => {
    const now = Date.now();
    const dt  = Math.max(1, now - lastPointerRef.current.t);
    const velX = (x - lastPointerRef.current.x) / dt * 16;
    const velY = (y - lastPointerRef.current.y) / dt * 16;
    lastPointerRef.current = { x, y, t: now };

    const s = stageRef.current;
    if (s === 'forming' || s === 'formed') {
      sysRef.current?.applyInteraction(x, y, velX, velY);
    }
    if (s === 'formed' && Math.hypot(velX, velY) > 4) {
      triggerDissolve();
    }
  }, [triggerDissolve]);

  const handlePointerUp = useCallback((x: number, y: number) => {
    const dx = x - lastPointerRef.current.x;
    const dy = y - lastPointerRef.current.y;
    // Small movement = tap
    if (Math.hypot(dx, dy) < 12 && stageRef.current === 'formed') {
      sysRef.current?.applyInteraction(x, y, 0, 0);
      triggerDissolve();
    }
  }, [triggerDissolve]);

  // ── Mouse events ───────────────────────────────────────────────────────────
  const isDragging = useRef(false);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    handlePointerDown(e.clientX, e.clientY);
  }, [handlePointerDown]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handlePointerMove(e.clientX, e.clientY);
  }, [handlePointerMove]);

  const onMouseUp = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    handlePointerUp(e.clientX, e.clientY);
  }, [handlePointerUp]);

  // ── Touch events ───────────────────────────────────────────────────────────
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    handlePointerDown(t.clientX, t.clientY);
  }, [handlePointerDown]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const t = e.touches[0];
    handlePointerMove(t.clientX, t.clientY);
  }, [handlePointerMove]);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    handlePointerUp(t.clientX, t.clientY);
  }, [handlePointerUp]);

  // ── Category click ────────────────────────────────────────────────────────
  const handleCategoryClick = useCallback((id: CategoryId) => {
    setActiveCategory(id);
    setStageSync('panel');
  }, [setStageSync]);

  const handlePanelClose = useCallback(() => {
    setActiveCategory(null);
    setStageSync('content');
  }, [setStageSync]);

  const positions = isMobile ? MOBILE_POS : DESKTOP_POS;

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        background: '#f0ebe0',
        position: 'relative',
        overflow: 'hidden',
        cursor: stage === 'forming' || stage === 'formed' ? 'crosshair' : 'default',
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={() => { isDragging.current = false; }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />

      {/* Content labels — visible only in content/panel stage */}
      {(stage === 'content' || stage === 'panel') && CATEGORIES.map(cat => (
        <button
          key={cat.id}
          onClick={() => handleCategoryClick(cat.id as CategoryId)}
          style={{
            position: 'absolute',
            left: positions[cat.id as CategoryId].left,
            top: positions[cat.id as CategoryId].top,
            transform: 'translate(-50%, -50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '14px 18px',
            fontFamily: 'var(--font-serif-jp), "Noto Serif JP", serif',
            fontSize: 'clamp(15px, 2.2vw, 19px)',
            fontWeight: 300,
            letterSpacing: '0.14em',
            color: labelsVisible ? 'rgba(28,22,14,0.72)' : 'rgba(28,22,14,0)',
            textShadow: 'none',
            transition: 'color 1.8s ease',
            WebkitTapHighlightColor: 'transparent',
            userSelect: 'none',
            zIndex: 10,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(28,22,14,0.92)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = labelsVisible ? 'rgba(28,22,14,0.72)' : 'rgba(28,22,14,0)'; }}
        >
          {cat.label}
        </button>
      ))}

      {/* Panel */}
      {stage === 'panel' && activeCategory && (
        <CategoryPanel
          categoryId={activeCategory}
          onClose={handlePanelClose}
        />
      )}
    </div>
  );
}
