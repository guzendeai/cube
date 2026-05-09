// Particle system + motif definitions for the HP experience.
// Monochrome particles (dark) on a light (cream) background.

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  currentOpacity: number;
  baseOpacity: number;
  radius: number;
  isHaze: boolean;        // haze=large+soft, grain=small+crisp
  state: 'gathering' | 'free' | 'flowing';
  flowAngle: number;      // set at dissolution start, per-particle variation
};

export type AttractorPoint = {
  x: number;      // center, normalized 0-1
  y: number;
  weight: number; // relative particle count
  sx: number;     // horizontal spread (stddev, normalized 0-1)
  sy: number;     // vertical spread
};

export type MotifDef = {
  id: string;
  label: string;
  attractors: AttractorPoint[];
};

export type ClusterTarget = {
  id: string;
  x: number;  // normalized 0-1
  y: number;
  weight: number;
};

// ─── Gaussian helper ─────────────────────────────────────────────────────────
function gauss(): number {
  const u1 = Math.random() + 1e-10;
  const u2 = Math.random();
  const raw = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  // clamp at ±2.5σ to avoid extreme outliers
  return Math.max(-2.5, Math.min(2.5, raw));
}

// ─── Motif Definitions ───────────────────────────────────────────────────────
// Each attractor defines a density zone. weight = relative particle count.
// sx/sy = Gaussian stddev in normalized coords (e.g. 0.04 ≈ 16px on 390px screen).

export const MOTIFS: MotifDef[] = [
  {
    id: 'person',
    label: '人',
    attractors: [
      { x: 0.50, y: 0.22, weight: 55,  sx: 0.033, sy: 0.038 }, // head
      { x: 0.50, y: 0.28, weight: 28,  sx: 0.016, sy: 0.018 }, // neck
      { x: 0.50, y: 0.34, weight: 70,  sx: 0.070, sy: 0.028 }, // shoulders
      { x: 0.50, y: 0.46, weight: 85,  sx: 0.038, sy: 0.058 }, // torso
      { x: 0.50, y: 0.56, weight: 60,  sx: 0.042, sy: 0.028 }, // hip
      { x: 0.45, y: 0.67, weight: 48,  sx: 0.020, sy: 0.058 }, // left leg
      { x: 0.55, y: 0.63, weight: 48,  sx: 0.020, sy: 0.058 }, // right leg (leading)
      { x: 0.43, y: 0.77, weight: 35,  sx: 0.024, sy: 0.018 }, // left foot
      { x: 0.57, y: 0.73, weight: 35,  sx: 0.024, sy: 0.018 }, // right foot
      { x: 0.50, y: 0.83, weight: 22,  sx: 0.095, sy: 0.012 }, // ground shadow
      { x: 0.28, y: 0.50, weight: 12,  sx: 0.110, sy: 0.190 }, // atmosphere L
      { x: 0.72, y: 0.50, weight: 12,  sx: 0.110, sy: 0.190 }, // atmosphere R
    ],
  },
  {
    id: 'wave',
    label: '波',
    attractors: [
      { x: 0.42, y: 0.38, weight: 95,  sx: 0.095, sy: 0.048 }, // main crest
      { x: 0.30, y: 0.31, weight: 80,  sx: 0.065, sy: 0.038 }, // curl
      { x: 0.57, y: 0.46, weight: 100, sx: 0.095, sy: 0.055 }, // wave face
      { x: 0.22, y: 0.25, weight: 45,  sx: 0.085, sy: 0.048 }, // foam top
      { x: 0.76, y: 0.55, weight: 65,  sx: 0.120, sy: 0.038 }, // water surface R
      { x: 0.16, y: 0.21, weight: 32,  sx: 0.095, sy: 0.062 }, // spray droplets
      { x: 0.50, y: 0.65, weight: 55,  sx: 0.195, sy: 0.045 }, // water below
      { x: 0.50, y: 0.73, weight: 25,  sx: 0.270, sy: 0.012 }, // horizon
    ],
  },
  {
    id: 'book',
    label: '本',
    attractors: [
      { x: 0.35, y: 0.47, weight: 100, sx: 0.095, sy: 0.095 }, // left page
      { x: 0.65, y: 0.47, weight: 100, sx: 0.095, sy: 0.095 }, // right page
      { x: 0.50, y: 0.47, weight: 38,  sx: 0.018, sy: 0.095 }, // spine
      { x: 0.50, y: 0.60, weight: 48,  sx: 0.115, sy: 0.028 }, // cover bottom
      { x: 0.35, y: 0.35, weight: 22,  sx: 0.075, sy: 0.012 }, // page edges top L
      { x: 0.65, y: 0.35, weight: 22,  sx: 0.075, sy: 0.012 }, // page edges top R
      { x: 0.50, y: 0.68, weight: 18,  sx: 0.145, sy: 0.015 }, // shadow
    ],
  },
  {
    id: 'bird',
    label: '鳥',
    attractors: [
      { x: 0.50, y: 0.46, weight: 65,  sx: 0.038, sy: 0.032 }, // body
      { x: 0.18, y: 0.37, weight: 75,  sx: 0.085, sy: 0.048 }, // left wing outer
      { x: 0.33, y: 0.42, weight: 58,  sx: 0.058, sy: 0.035 }, // left wing inner
      { x: 0.82, y: 0.37, weight: 75,  sx: 0.085, sy: 0.048 }, // right wing outer
      { x: 0.67, y: 0.42, weight: 58,  sx: 0.058, sy: 0.035 }, // right wing inner
      { x: 0.55, y: 0.43, weight: 38,  sx: 0.028, sy: 0.022 }, // head/beak
      { x: 0.46, y: 0.51, weight: 28,  sx: 0.035, sy: 0.028 }, // tail
      { x: 0.50, y: 0.26, weight: 12,  sx: 0.240, sy: 0.110 }, // sky top
      { x: 0.50, y: 0.70, weight: 8,   sx: 0.290, sy: 0.095 }, // sky bottom
    ],
  },
  {
    id: 'sunset',
    label: '夕陽',
    attractors: [
      { x: 0.50, y: 0.42, weight: 115, sx: 0.065, sy: 0.068 }, // sun disk
      { x: 0.50, y: 0.42, weight: 75,  sx: 0.115, sy: 0.118 }, // sun inner glow
      { x: 0.50, y: 0.42, weight: 38,  sx: 0.185, sy: 0.190 }, // sun outer glow
      { x: 0.50, y: 0.54, weight: 85,  sx: 0.270, sy: 0.008 }, // horizon line
      { x: 0.28, y: 0.35, weight: 38,  sx: 0.145, sy: 0.095 }, // sky upper L
      { x: 0.72, y: 0.35, weight: 38,  sx: 0.145, sy: 0.095 }, // sky upper R
      { x: 0.50, y: 0.63, weight: 65,  sx: 0.190, sy: 0.075 }, // water reflection
      { x: 0.50, y: 0.61, weight: 48,  sx: 0.048, sy: 0.045 }, // reflection column
    ],
  },
  {
    id: 'landscape',
    label: '風景',
    attractors: [
      { x: 0.50, y: 0.22, weight: 35,  sx: 0.430, sy: 0.130 }, // sky
      { x: 0.50, y: 0.41, weight: 95,  sx: 0.330, sy: 0.115 }, // distant hills
      { x: 0.50, y: 0.55, weight: 85,  sx: 0.380, sy: 0.058 }, // mid-ground treeline
      { x: 0.50, y: 0.67, weight: 70,  sx: 0.430, sy: 0.078 }, // foreground ground
      { x: 0.25, y: 0.45, weight: 28,  sx: 0.095, sy: 0.145 }, // tree cluster L
      { x: 0.75, y: 0.43, weight: 28,  sx: 0.095, sy: 0.145 }, // tree cluster R
    ],
  },
  {
    id: 'station',
    label: '駅のホーム',
    attractors: [
      { x: 0.50, y: 0.64, weight: 95,  sx: 0.430, sy: 0.025 }, // platform surface
      { x: 0.50, y: 0.32, weight: 75,  sx: 0.400, sy: 0.018 }, // canopy/roof
      { x: 0.25, y: 0.47, weight: 58,  sx: 0.018, sy: 0.145 }, // pillar L
      { x: 0.50, y: 0.47, weight: 58,  sx: 0.018, sy: 0.145 }, // pillar C
      { x: 0.75, y: 0.47, weight: 58,  sx: 0.018, sy: 0.145 }, // pillar R
      { x: 0.50, y: 0.72, weight: 45,  sx: 0.430, sy: 0.010 }, // track line
      { x: 0.50, y: 0.40, weight: 25,  sx: 0.075, sy: 0.140 }, // vanishing depth
    ],
  },
  {
    id: 'seaside',
    label: '海辺',
    attractors: [
      { x: 0.50, y: 0.71, weight: 95,  sx: 0.430, sy: 0.075 }, // beach sand
      { x: 0.50, y: 0.60, weight: 75,  sx: 0.430, sy: 0.035 }, // wave breaking
      { x: 0.50, y: 0.50, weight: 68,  sx: 0.430, sy: 0.075 }, // sea/water
      { x: 0.50, y: 0.43, weight: 45,  sx: 0.430, sy: 0.010 }, // horizon
      { x: 0.50, y: 0.30, weight: 28,  sx: 0.430, sy: 0.110 }, // sky
      { x: 0.50, y: 0.57, weight: 38,  sx: 0.430, sy: 0.035 }, // foam/spray
    ],
  },
  {
    id: 'bench',
    label: 'ベンチ',
    attractors: [
      { x: 0.50, y: 0.52, weight: 88,  sx: 0.190, sy: 0.018 }, // seat
      { x: 0.50, y: 0.44, weight: 68,  sx: 0.190, sy: 0.018 }, // backrest
      { x: 0.50, y: 0.48, weight: 38,  sx: 0.014, sy: 0.048 }, // backrest support
      { x: 0.37, y: 0.61, weight: 38,  sx: 0.014, sy: 0.078 }, // leg front L
      { x: 0.63, y: 0.61, weight: 38,  sx: 0.014, sy: 0.078 }, // leg front R
      { x: 0.39, y: 0.59, weight: 28,  sx: 0.014, sy: 0.068 }, // leg back L
      { x: 0.61, y: 0.59, weight: 28,  sx: 0.014, sy: 0.068 }, // leg back R
      { x: 0.50, y: 0.70, weight: 18,  sx: 0.210, sy: 0.015 }, // ground shadow
      { x: 0.18, y: 0.48, weight: 14,  sx: 0.095, sy: 0.190 }, // tree atmosphere L
      { x: 0.82, y: 0.48, weight: 14,  sx: 0.095, sy: 0.190 }, // tree atmosphere R
      { x: 0.50, y: 0.76, weight: 18,  sx: 0.430, sy: 0.045 }, // ground
    ],
  },
  {
    id: 'forest',
    label: '森',
    attractors: [
      { x: 0.25, y: 0.61, weight: 58,  sx: 0.018, sy: 0.190 }, // trunk 1
      { x: 0.50, y: 0.59, weight: 68,  sx: 0.022, sy: 0.210 }, // trunk 2 (center)
      { x: 0.75, y: 0.63, weight: 58,  sx: 0.018, sy: 0.175 }, // trunk 3
      { x: 0.37, y: 0.63, weight: 38,  sx: 0.014, sy: 0.145 }, // trunk 4
      { x: 0.63, y: 0.61, weight: 38,  sx: 0.014, sy: 0.145 }, // trunk 5
      { x: 0.25, y: 0.34, weight: 78,  sx: 0.095, sy: 0.115 }, // canopy 1
      { x: 0.50, y: 0.29, weight: 98,  sx: 0.115, sy: 0.135 }, // canopy 2 (main)
      { x: 0.75, y: 0.32, weight: 78,  sx: 0.095, sy: 0.115 }, // canopy 3
      { x: 0.50, y: 0.76, weight: 68,  sx: 0.430, sy: 0.055 }, // undergrowth
      { x: 0.34, y: 0.52, weight: 18,  sx: 0.038, sy: 0.145 }, // light between L
      { x: 0.64, y: 0.50, weight: 18,  sx: 0.038, sy: 0.145 }, // light between R
    ],
  },
  {
    id: 'smoke',
    label: '煙',
    attractors: [
      { x: 0.50, y: 0.78, weight: 115, sx: 0.038, sy: 0.038 }, // source dense
      { x: 0.50, y: 0.65, weight: 88,  sx: 0.058, sy: 0.058 }, // rising col 1
      { x: 0.48, y: 0.52, weight: 68,  sx: 0.078, sy: 0.075 }, // rising col 2
      { x: 0.46, y: 0.40, weight: 58,  sx: 0.115, sy: 0.078 }, // expanding upper
      { x: 0.43, y: 0.28, weight: 48,  sx: 0.175, sy: 0.095 }, // wide diffusion
      { x: 0.40, y: 0.18, weight: 28,  sx: 0.215, sy: 0.115 }, // final haze
      { x: 0.50, y: 0.45, weight: 18,  sx: 0.290, sy: 0.190 }, // atmosphere
    ],
  },
  {
    id: 'campfire',
    label: '焚き火',
    attractors: [
      { x: 0.50, y: 0.62, weight: 115, sx: 0.038, sy: 0.058 }, // fire core
      { x: 0.46, y: 0.54, weight: 78,  sx: 0.028, sy: 0.058 }, // flame L
      { x: 0.54, y: 0.55, weight: 78,  sx: 0.028, sy: 0.058 }, // flame R
      { x: 0.50, y: 0.47, weight: 48,  sx: 0.028, sy: 0.058 }, // flame tip
      { x: 0.44, y: 0.68, weight: 58,  sx: 0.058, sy: 0.018 }, // log L
      { x: 0.56, y: 0.68, weight: 58,  sx: 0.058, sy: 0.018 }, // log R
      { x: 0.50, y: 0.68, weight: 38,  sx: 0.115, sy: 0.038 }, // ember scatter
      { x: 0.50, y: 0.76, weight: 28,  sx: 0.145, sy: 0.018 }, // ground shadow
      { x: 0.50, y: 0.58, weight: 28,  sx: 0.190, sy: 0.190 }, // radiant light
      { x: 0.47, y: 0.41, weight: 18,  sx: 0.055, sy: 0.075 }, // sparks L
      { x: 0.53, y: 0.39, weight: 18,  sx: 0.055, sy: 0.075 }, // sparks R
    ],
  },
];

// ─── ParticleSystem ──────────────────────────────────────────────────────────

const PI2 = Math.PI * 2;
const BUCKET_COUNT = 24; // opacity quantization buckets for batched drawing

export class ParticleSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[];
  private animId = 0;
  private time = 0;
  private dissolveCallback: (() => void) | null = null;
  private dissolveStarted = false;
  private dissolveTime = 0;
  private buckets: Particle[][];

  constructor(canvas: HTMLCanvasElement, count: number) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.particles = this.createParticles(count);
    this.buckets = Array.from({ length: BUCKET_COUNT }, () => []);
  }

  private createParticles(count: number): Particle[] {
    const w = this.canvas.width;
    const h = this.canvas.height;
    return Array.from({ length: count }, () => {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const isHaze = Math.random() < 0.38;
      const baseOpacity = isHaze
        ? 0.012 + Math.random() * 0.022
        : 0.048 + Math.random() * 0.095;
      const radius = isHaze
        ? 1.6 + Math.random() * 2.4
        : 0.4 + Math.random() * 1.2;
      return {
        x, y,
        vx: 0, vy: 0,
        targetX: x, targetY: y,
        currentOpacity: 0,  // fade in from 0
        baseOpacity,
        radius,
        isHaze,
        state: 'free' as const,
        flowAngle: Math.random() * PI2,
      };
    });
  }

  // Assign particles to attractors using gaussian distribution
  setMotif(motif: MotifDef): void {
    this.dissolveStarted = false;
    this.dissolveCallback = null;

    const w = this.canvas.width;
    const h = this.canvas.height;
    const totalWeight = motif.attractors.reduce((s, a) => s + a.weight, 0);

    let idx = 0;
    for (const attr of motif.attractors) {
      const count = Math.round((attr.weight / totalWeight) * this.particles.length);
      for (let i = 0; i < count && idx < this.particles.length; i++) {
        const p = this.particles[idx++];
        p.targetX = (attr.x + gauss() * attr.sx) * w;
        p.targetY = (attr.y + gauss() * attr.sy) * h;
        // clamp within canvas
        p.targetX = Math.max(0, Math.min(w, p.targetX));
        p.targetY = Math.max(0, Math.min(h, p.targetY));
        p.state = 'gathering';
      }
    }
    // Remaining particles drift free (atmospheric)
    for (; idx < this.particles.length; idx++) {
      this.particles[idx].state = 'free';
    }
  }

  // Apply physics at interaction point
  applyInteraction(px: number, py: number, velX: number, velY: number): void {
    const speed = Math.hypot(velX, velY);
    const isTap = speed < 1.5;
    const radius = isTap ? 110 : 75;
    const force = isTap ? 3.5 : Math.min(5.5, speed * 0.55);

    for (const p of this.particles) {
      const dx = p.x - px;
      const dy = p.y - py;
      const dist = Math.hypot(dx, dy);
      if (dist > radius || dist < 0.01) continue;
      const falloff = 1 - dist / radius;
      if (isTap) {
        // Radial burst
        p.vx += (dx / dist) * force * falloff * 2.8;
        p.vy += (dy / dist) * force * falloff * 2.8;
        if (p.state === 'gathering') p.state = 'free';
      } else {
        // Flow with swipe velocity
        p.vx += velX * 0.28 * falloff;
        p.vy += velY * 0.28 * falloff;
        if (p.state === 'gathering') p.state = 'free';
      }
    }
  }

  // Dissolve motif: particles flow organically then call callback
  dissolve(callback: () => void): void {
    if (this.dissolveStarted) return;
    this.dissolveStarted = true;
    this.dissolveCallback = callback;
    this.dissolveTime = this.time;

    // Assign a global flow direction with per-particle variation
    const baseAngle = Math.random() * PI2;
    for (const p of this.particles) {
      p.flowAngle = baseAngle + (Math.random() - 0.5) * Math.PI * 0.65;
      p.state = 'flowing';
    }
  }

  // Move particles toward 6 category cluster positions
  formClusters(clusters: ClusterTarget[]): void {
    this.dissolveStarted = false;
    this.dissolveCallback = null;

    const w = this.canvas.width;
    const h = this.canvas.height;
    const totalWeight = clusters.reduce((s, c) => s + c.weight, 0);

    let idx = 0;
    for (const cluster of clusters) {
      const count = Math.round((cluster.weight / totalWeight) * this.particles.length);
      for (let i = 0; i < count && idx < this.particles.length; i++) {
        const p = this.particles[idx++];
        const angle = Math.random() * PI2;
        const r = Math.random() * 36;
        p.targetX = cluster.x * w + Math.cos(angle) * r;
        p.targetY = cluster.y * h + Math.sin(angle) * r;
        p.targetX = Math.max(0, Math.min(w, p.targetX));
        p.targetY = Math.max(0, Math.min(h, p.targetY));
        p.state = 'gathering';
      }
    }
    for (; idx < this.particles.length; idx++) {
      const p = this.particles[idx];
      // Sparse free particles give the content screen atmosphere
      p.state = 'free';
      p.vx = (Math.random() - 0.5) * 0.4;
      p.vy = (Math.random() - 0.5) * 0.4;
    }
  }

  resize(): void {
    // Particles keep their current positions; targets may be off-screen briefly
    // (setMotif will be called again from the component if needed)
  }

  start(): void {
    const loop = () => {
      this.time += 0.016;
      this.tick();
      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  }

  private tick(): void {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const t = this.time;

    // ── Background ──────────────────────────────────────────────────────────
    ctx.fillStyle = '#f0ebe0';
    ctx.fillRect(0, 0, w, h);

    // ── Update particles ────────────────────────────────────────────────────
    const dissolving = this.dissolveStarted;
    const dissolveAge = dissolving ? t - this.dissolveTime : 0;

    for (const p of this.particles) {
      if (p.state === 'gathering') {
        const lerp = 0.038;
        p.x += (p.targetX - p.x) * lerp;
        p.y += (p.targetY - p.y) * lerp;
        p.vx *= 0.80;
        p.vy *= 0.80;
        p.x += p.vx;
        p.y += p.vy;
        p.currentOpacity += (p.baseOpacity - p.currentOpacity) * 0.045;

      } else if (p.state === 'flowing') {
        // Organic flow field with per-particle angle
        const speed = 0.25 + Math.sin(t * 0.3 + p.flowAngle) * 0.08;
        p.vx += Math.cos(p.flowAngle) * speed;
        p.vy += Math.sin(p.flowAngle) * speed;
        // Slight curl over time
        p.flowAngle += 0.004;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.x += p.vx;
        p.y += p.vy;
        // Opacity gradually fades during dissolution
        const fadeFactor = Math.max(0, 1 - dissolveAge / 3.5);
        p.currentOpacity = p.baseOpacity * fadeFactor;
        // Wrap around edges
        if (p.x < -20) p.x = w + 20;
        else if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        else if (p.y > h + 20) p.y = -20;

      } else {
        // free: drift with damping + gentle noise
        const nx = (p.x / w) * 3.5;
        const ny = (p.y / h) * 3.5;
        const noiseAngle = Math.sin(nx + t * 0.22) * 1.1 + Math.cos(ny + t * 0.15) * 0.7;
        p.vx += Math.cos(noiseAngle) * 0.018;
        p.vy += Math.sin(noiseAngle) * 0.018;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx) * 0.4; }
        else if (p.x > w) { p.x = w; p.vx = -Math.abs(p.vx) * 0.4; }
        if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy) * 0.4; }
        else if (p.y > h) { p.y = h; p.vy = -Math.abs(p.vy) * 0.4; }
        p.currentOpacity += (p.baseOpacity * 0.35 - p.currentOpacity) * 0.03;
      }
    }

    // ── Draw (batched by opacity bucket) ────────────────────────────────────
    for (const b of this.buckets) b.length = 0;

    for (const p of this.particles) {
      if (p.currentOpacity < 0.004) continue;
      const bi = Math.min(BUCKET_COUNT - 1, Math.floor(p.currentOpacity * BUCKET_COUNT));
      this.buckets[bi].push(p);
    }

    ctx.fillStyle = 'rgb(28, 22, 14)';
    for (let bi = 0; bi < BUCKET_COUNT; bi++) {
      const group = this.buckets[bi];
      if (group.length === 0) continue;
      ctx.globalAlpha = (bi + 0.5) / BUCKET_COUNT;
      ctx.beginPath();
      for (const p of group) {
        ctx.moveTo(p.x + p.radius, p.y);
        ctx.arc(p.x, p.y, p.radius, 0, PI2);
      }
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // ── Check dissolution complete ──────────────────────────────────────────
    if (dissolving && dissolveAge > 3.8) {
      this.dissolveStarted = false;
      const cb = this.dissolveCallback;
      this.dissolveCallback = null;
      cb?.();
    }
  }

  destroy(): void {
    cancelAnimationFrame(this.animId);
  }
}
