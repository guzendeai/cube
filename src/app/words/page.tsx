'use client';

// src/app/words/page.tsx
// 白い空間に1冊の本を静かに置く。
// 背表紙帯なし。表紙全面 + 右端ページ断面 + 自然な影で「本」を表現。

import Link from 'next/link';
import Image from 'next/image';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function WordsInner() {
  const [hovered, setHovered] = useState(false);
  const searchParams = useSearchParams();
  const recordingMode = searchParams.get('recording') === '1';
  const novelHref = recordingMode ? '/words/novel?recording=1' : '/words/novel';

  function handlePageClick() {
    if (!recordingMode) return;
    window.location.href = novelHref;
  }

  return (
    <div
      onClick={handlePageClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#f5f1e8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        cursor: recordingMode ? 'pointer' : 'default',
      }}
    >
      {/* やわらかい光 */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 30%, rgba(255,253,248,0.70) 0%, transparent 70%)',
      }} />

      {/* 戻るリンク */}
      <div style={{ position: 'absolute', top: '28px', left: 'clamp(20px, 5vw, 40px)', zIndex: 10 }} onClick={e => e.stopPropagation()}>
        <Link
          href="/"
          style={{
            fontSize: '10px', color: 'rgba(50,44,36,0.36)', textDecoration: 'none',
            letterSpacing: '0.12em', fontFamily: 'Georgia, serif',
            transition: 'color 0.2s ease', display: 'inline-block', padding: '6px 0',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(50,44,36,0.76)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(50,44,36,0.36)')}
        >
          ← もどる
        </Link>
      </div>

      {/* Words */}
      <div style={{
        position: 'absolute', top: '34px', right: 'clamp(20px, 5vw, 40px)',
        fontSize: '10px', color: 'rgba(50,44,36,0.24)',
        letterSpacing: '0.22em', fontFamily: 'Georgia, serif', textTransform: 'uppercase',
      }}>
        Words
      </div>

      {/* 1冊の本 */}
      <Link href={novelHref} style={{ display: 'block', textDecoration: 'none' }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            position: 'relative',
            width: 'clamp(180px, 34vw, 260px)',
            height: 'clamp(248px, 48vw, 356px)',
            cursor: 'pointer',
            // ごく弱い傾きで「置かれた本」感
            transform: hovered
              ? 'translateY(-8px) rotate(-0.6deg)'
              : 'translateY(0) rotate(-0.3deg)',
            transition: 'transform 0.45s ease',
          }}
        >
          {/* 表紙（画像全面） */}
          <div style={{
            position: 'absolute', inset: 0,
            overflow: 'hidden',
            borderRadius: '2px',
            // 本の自然な落ち影
            boxShadow: hovered
              ? '0 20px 52px rgba(50,40,28,0.28), 0 6px 18px rgba(50,40,28,0.16), 3px 3px 0 0 rgba(50,40,28,0.08)'
              : '0 12px 36px rgba(50,40,28,0.22), 0 3px 10px rgba(50,40,28,0.12), 2px 2px 0 0 rgba(50,40,28,0.06)',
            transition: 'box-shadow 0.45s ease',
          }}>
            <Image
              src="/images/words/kimi-hoshi-cover.png"
              alt="汝、星のごとく"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center top' }}
              sizes="(max-width: 640px) 36vw, 260px"
              priority
            />

            {/* 表紙左端：綴じ部分の薄い影（背表紙との接合を暗示） */}
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '14px',
              background: 'linear-gradient(to right, rgba(0,0,0,0.18), transparent)',
              pointerEvents: 'none',
            }} />

            {/* 表紙上端：わずかな光（厚みの暗示） */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
              background: 'rgba(255,255,255,0.12)',
              pointerEvents: 'none',
            }} />
          </div>

          {/* 右端：ページ断面（小口） */}
          <div style={{
            position: 'absolute',
            top: '3px', bottom: '3px', right: '-5px',
            width: '5px',
            background: 'linear-gradient(to right, rgba(232,224,210,0.60), rgba(218,210,196,0.25))',
            borderRadius: '0 1px 1px 0',
          }} />

          {/* 下端：ページ断面（天地の小口） */}
          <div style={{
            position: 'absolute',
            bottom: '-4px', left: '3px', right: '2px',
            height: '4px',
            background: 'linear-gradient(to bottom, rgba(220,212,198,0.50), rgba(200,192,178,0.18))',
            borderRadius: '0 0 1px 1px',
          }} />
        </div>
      </Link>
    </div>
  );
}

export default function WordsPage() {
  return (
    <Suspense>
      <WordsInner />
    </Suspense>
  );
}
