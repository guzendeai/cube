'use client';

// src/app/page.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ContentItem } from '@/data/contents';
import ContentModal from '@/components/ContentModal';

const Cube3D = dynamic(() => import('@/components/Cube3D'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: 'clamp(220px, 72vw, 380px)',
      height: 'clamp(220px, 52vh, 380px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        fontSize: '10px',
        color: 'var(--air-ink-faint)',
        letterSpacing: '0.14em',
        fontFamily: 'Georgia, serif',
      }}>
        —
      </div>
    </div>
  ),
});

function useCubeSize() {
  const [size, setSize] = useState(340);
  useEffect(() => {
    function update() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const base = Math.min(vw * 0.72, vh * 0.52, 380);
      setSize(Math.max(220, Math.floor(base)));
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return size;
}

export default function HomePage() {
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [showHint, setShowHint] = useState(true);
  const [mounted, setMounted] = useState(false);
  const cubeSize = useCubeSize();

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--air-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 80% 60% at 50% -10%,
              rgba(190,210,205,0.28) 0%,
              transparent 70%)
          `,
          pointerEvents: 'none',
          animation: 'breathe 12s ease-in-out infinite',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 60% 40% at 50% 110%,
              rgba(210,205,185,0.20) 0%,
              transparent 65%)
          `,
          pointerEvents: 'none',
          animation: 'breathe 16s ease-in-out infinite reverse',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 40% 70% at -5% 50%,
              rgba(180,200,195,0.12) 0%,
              transparent 60%),
            radial-gradient(ellipse 40% 70% at 105% 50%,
              rgba(195,200,185,0.10) 0%,
              transparent 60%)
          `,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex: 10,
          opacity: mounted ? 1 : 0,
          transition: 'opacity 1.2s ease 0.4s',
        }}
      >
        <h1
          style={{
            fontSize: '11px',
            fontWeight: 400,
            letterSpacing: '0.28em',
            color: 'var(--air-ink-light)',
            fontFamily: 'Georgia, serif',
            margin: 0,
            textTransform: 'uppercase',
          }}
        >
          Portfolio
        </h1>
        <div
          style={{
            width: '20px',
            height: '1px',
            background: 'var(--air-border)',
            margin: '10px auto 0',
          }}
        />
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 5,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)',
          transition: 'all 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s',
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: `-${Math.round(cubeSize * 0.10)}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            width: `${Math.round(cubeSize * 0.80)}px`,
            height: `${Math.round(cubeSize * 0.10)}px`,
            background: 'radial-gradient(ellipse, rgba(80,100,80,0.10) 0%, transparent 72%)',
            pointerEvents: 'none',
          }}
        />

        <Cube3D onFaceClick={setSelectedContent} size={cubeSize} />
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '116px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          opacity: showHint ? 0.55 : 0,
          transition: 'opacity 1s ease',
          pointerEvents: 'none',
          zIndex: 10,
          whiteSpace: 'nowrap',
        }}
      >
        <div style={{
          fontSize: '10px',
          color: 'var(--air-ink-light)',
          letterSpacing: '0.14em',
          fontFamily: 'Georgia, serif',
        }}>
          drag to rotate
        </div>
        <div
          style={{
            marginTop: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <span style={{
            fontSize: '16px',
            color: 'var(--air-ink-faint)',
            animation: 'bounceX 1.6s ease-in-out infinite',
          }}>←</span>
          <span style={{
            fontSize: '16px',
            color: 'var(--air-ink-faint)',
            animation: 'bounceX 1.6s ease-in-out infinite reverse',
          }}>→</span>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '36px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '28px',
          zIndex: 10,
          opacity: mounted ? 1 : 0,
          transition: 'opacity 1.2s ease 0.9s',
          whiteSpace: 'nowrap',
        }}
      >
        <Link
          href="/contents"
          style={{
            fontSize: '12px',
            color: 'var(--air-ink-light)',
            textDecoration: 'none',
            letterSpacing: '0.14em',
            fontFamily: 'Georgia, serif',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 0',
            transition: 'color 0.25s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--air-ink)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--air-ink-light)')}
        >
          <span style={{ fontSize: '14px', opacity: 0.7 }}>⊞</span>
          すべてを見る
        </Link>

        {/* about リンクは /about ページ完成後に復活させる
        <div style={{ width: '1px', height: '14px', background: 'var(--air-border)' }} />
        <Link
          href="/about"
          style={{
            fontSize: '12px',
            color: 'var(--air-ink-light)',
            textDecoration: 'none',
            letterSpacing: '0.14em',
            fontFamily: 'Georgia, serif',
            padding: '6px 0',
            transition: 'color 0.25s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--air-ink)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--air-ink-light)')}
        >
          about
        </Link>
        */}
      </div>

      <ContentModal
        content={selectedContent}
        onClose={() => setSelectedContent(null)}
      />
    </div>
  );
}
