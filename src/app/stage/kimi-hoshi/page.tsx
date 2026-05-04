'use client';

// src/app/stage/kimi-hoshi/page.tsx
// 「汝、星のごとく」演出プロトタイプ
// セリフ群単位で背景を固定し、タップで順番に読み進める体験

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// ── データ構造 ────────────────────────────────────────────────────────────────
type Quote = {
  bg: 'sea' | 'fireworks';
  textAlign: 'center' | 'right';  // PC での横位置（スマホは常に center）
  speaker: string;
  work: string;
  slides: string[];
};

const QUOTES: Quote[] = [
  // ── 林瞳子（sea / 2枚）──────────────────────────────────────────────────────
  {
    bg: 'sea',
    textAlign: 'center',
    speaker: '林瞳子',
    work: '汝、星のごとく',
    slides: [
      'いざってときは、\n誰になんて言われようと\n好きなことをしなさいね。',
      '怖いのは、\nえいって飛び越える一瞬だけよ。\n飛び越えたらあとはもう自由なの',
    ],
  },
  // ── 北原先生（sea / 2枚）──────────────────────────────────────────────────────
  {
    bg: 'sea',
    textAlign: 'center',
    speaker: '北原先生',
    work: '汝、星のごとく',
    slides: [
      'ぼくは過去に間違えましたが、\n『つい間違えた』わけではありません。\n間違えようと思って間違えたんです。',
      '後悔はしていませんが、\nそんな間違いは\n一度で充分だとも思っています。',
    ],
  },
  // ── 井上暁海（sea / 1枚）────────────────────────────────────────────────────
  {
    bg: 'sea',
    textAlign: 'center',
    speaker: '井上暁海',
    work: '汝、星のごとく',
    slides: [
      'いつだって核心は\n言葉の届かない深い場所にある。',
    ],
  },
  // ── 青埜櫂（sea / 1枚）──────────────────────────────────────────────────────
  {
    bg: 'sea',
    textAlign: 'center',
    speaker: '青埜櫂',
    work: '汝、星のごとく',
    slides: [
      '―――夕星やな。',
    ],
  },
  // ── 青埜櫂（fireworks / 1枚）────────────────────────────────────────────────
  {
    bg: 'fireworks',
    textAlign: 'right',
    speaker: '青埜櫂',
    work: '汝、星のごとく',
    slides: [
      '安心感は侮りによく似ている。',
    ],
  },
  // ── 北原先生（fireworks / 1枚）──────────────────────────────────────────────
  {
    bg: 'fireworks',
    textAlign: 'right',
    speaker: '北原先生',
    work: '汝、星のごとく',
    slides: [
      '自分を縛る鎖は自分で選ぶ',
    ],
  },
  // ── 井上暁海（fireworks / 1枚）──────────────────────────────────────────────
  {
    bg: 'fireworks',
    textAlign: 'right',
    speaker: '井上暁海',
    work: '汝、星のごとく',
    slides: [
      '噂の的はいつも孤独だ。',
    ],
  },
];

const BG_SRC = {
  sea: '/images/stage/kimi-hoshi-sea.jpg',
  fireworks: '/images/stage/kimi-hoshi-fireworks.jpg',
};

// 現在と異なるランダムなQuoteインデックスを返す
function nextRandomQuoteIdx(current: number): number {
  if (QUOTES.length === 1) return 0;
  let next: number;
  do {
    next = Math.floor(Math.random() * QUOTES.length);
  } while (next === current);
  return next;
}

// ── メインコンポーネント ──────────────────────────────────────────────────────
export default function KimiHoshiPage() {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideKey, setSlideKey] = useState(0); // テキストフェード用
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const lastTouchEndTime = useRef<number>(0); // タップ二重発火防止

  const quote = QUOTES[quoteIdx];
  const isLastSlide = slideIdx === quote.slides.length - 1;

  function advance() {
    if (isTransitioning) return;

    if (!isLastSlide) {
      // セリフ群の中を進む（背景はそのまま）
      setSlideIdx(s => s + 1);
      setSlideKey(k => k + 1);
    } else {
      // セリフ群の最後 → ランダムに次のセリフ群へ
      const next = nextRandomQuoteIdx(quoteIdx);
      setIsTransitioning(true);
      setQuoteIdx(next);
      setSlideIdx(0);
      setSlideKey(k => k + 1);
      setTimeout(() => setIsTransitioning(false), 1200);
    }
  }

  function retreat() {
    if (isTransitioning) return;

    if (slideIdx > 0) {
      setSlideIdx(s => s - 1);
      setSlideKey(k => k + 1);
    }
    // セリフ群をまたいで戻る機能は持たない（ランダム進行のため）
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    lastTouchEndTime.current = Date.now();
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) < 40 && Math.abs(dy) < 40) {
      // タップ
      advance();
    } else if (Math.abs(dx) > Math.abs(dy)) {
      // 横スワイプ
      if (dx < -40) advance();
      else if (dx > 40) retreat();
    }
    // 縦スワイプは無視（スクロール意図とみなす）
    touchStartX.current = null;
    touchStartY.current = null;
  }

  function handleClick() {
    // タッチ直後（500ms以内）の合成clickは無視
    if (Date.now() - lastTouchEndTime.current < 500) return;
    advance();
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        cursor: 'pointer',
        userSelect: 'none',
      }}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── 背景：海（常に下に敷く） ── */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image
          src={BG_SRC.sea}
          alt=""
          fill
          style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
          priority
          sizes="100vw"
        />
      </div>

      {/* ── 背景：花火（quote.bg === 'fireworks' でフェードイン） ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: quote.bg === 'fireworks' ? 1 : 0,
          transition: 'opacity 1.2s ease',
        }}
      >
        <Image
          src={BG_SRC.fireworks}
          alt=""
          fill
          style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
          sizes="100vw"
        />
      </div>

      {/* ── オーバーレイ ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: quote.bg === 'fireworks'
            ? 'rgba(0,0,10,0.38)'
            : 'rgba(0,0,0,0.22)',
          transition: 'background 1.2s ease',
        }}
      />

      {/* ── 戻るリンク ── */}
      <div
        style={{ position: 'absolute', top: '28px', left: '28px', zIndex: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <Link
          href="/words"
          style={{
            fontSize: '10px',
            color: 'rgba(255,255,255,0.50)',
            textDecoration: 'none',
            letterSpacing: '0.12em',
            fontFamily: 'Georgia, serif',
            padding: '6px 0',
            transition: 'color 0.2s ease',
            display: 'inline-block',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.50)')}
        >
          ← Words
        </Link>
      </div>

      {/* ── 縦書きテキスト ── */}
      {/*
        PC: data-align="center" → 中央 / data-align="right" → 右寄せ
        スマホ: 常に中央（CSS で上書き）
      */}
      <div
        className="stage-text-wrap"
        data-align={quote.textAlign}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <p
          key={slideKey}
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            fontFamily: "'Yu Mincho', '游明朝', 'YuMincho', 'Hiragino Mincho ProN', 'ヒラギノ明朝 ProN', var(--font-serif-jp), serif",
            fontSize: 'clamp(18px, 4.5vw, 24px)',
            fontWeight: 300,
            lineHeight: 2.4,
            letterSpacing: '0.18em',
            color: quote.bg === 'fireworks'
              ? 'rgba(255,252,245,0.95)'
              : 'rgba(255,253,248,0.92)',
            textShadow: quote.bg === 'fireworks'
              ? '0 0 24px rgba(180,160,255,0.25), 0 1px 8px rgba(0,0,0,0.6)'
              : '0 1px 12px rgba(0,0,0,0.45)',
            margin: 0,
            whiteSpace: 'pre-wrap',
            maxHeight: '70vh',
            animation: 'stageFadeIn 0.9s ease forwards',
          }}
        >
          {quote.slides[slideIdx]}
        </p>
      </div>

      {/* ── 話者名・作品名（各セリフ群の最後のスライドで表示） ── */}
      {/* fireworks のときだけ右下、それ以外は左下 */}
      <div
        style={{
          position: 'absolute',
          bottom: '72px',
          ...(quote.bg === 'fireworks'
            ? { right: '32px', textAlign: 'right' }
            : { left: '32px',  textAlign: 'left'  }),
          opacity: isLastSlide ? 1 : 0,
          transition: 'opacity 0.8s ease 0.5s',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontFamily: "'Yu Mincho', '游明朝', 'YuMincho', 'Hiragino Mincho ProN', 'ヒラギノ明朝 ProN', var(--font-serif-jp), serif",
            fontSize: '10px',
            color: 'rgba(255,252,245,0.68)',
            letterSpacing: '0.14em',
            lineHeight: 2.0,
          }}
        >
          <div>{quote.speaker}</div>
          <div style={{ marginTop: '4px', fontSize: '9px', letterSpacing: '0.10em' }}>
            {quote.work} ──
          </div>
        </div>
      </div>

      {/* ── スライドインジケーター（現在のセリフ群内の位置を表示） ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        {quote.slides.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === slideIdx ? '18px' : '4px',
              height: '2px',
              borderRadius: '1px',
              background: i === slideIdx
                ? 'rgba(255,255,255,0.75)'
                : 'rgba(255,255,255,0.28)',
              transition: 'all 0.4s ease',
            }}
          />
        ))}
      </div>

      {/* ── 最初のスライドのヒント ── */}
      {slideIdx === 0 && (
        <div
          key={`hint-${quoteIdx}`}
          style={{
            position: 'absolute',
            bottom: '56px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '9px',
            color: 'rgba(255,255,255,0.28)',
            letterSpacing: '0.14em',
            fontFamily: 'Georgia, serif',
            whiteSpace: 'nowrap',
            animation: 'stageFadeIn 2s ease 1.5s both',
            pointerEvents: 'none',
          }}
        >
          tap to read
        </div>
      )}

      <style>{`
        /* PC: data-align に従って横位置を決める */
        @media (min-width: 768px) {
          .stage-text-wrap[data-align="center"] {
            justify-content: center;
          }
          .stage-text-wrap[data-align="right"] {
            justify-content: flex-end;
            padding-right: clamp(48px, 10vw, 140px);
          }
        }
        /* スマホ: 常に中央 */
        @media (max-width: 767px) {
          .stage-text-wrap {
            justify-content: center !important;
            padding-right: 0 !important;
          }
        }
        @keyframes stageFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
