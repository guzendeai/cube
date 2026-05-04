'use client';

// src/app/words/[genre]/page.tsx
// 開いた本のように詩を読むページ。
// PC: 見開き（左ページ：詩 / 右ページ：属性・ナビ）
// SP: 1ページずつ
//
// 録画モード: URL に ?recording=1 を付けると
// ページ内クリック / タップで次ページへ進む（カーソル操作不要）。
// 撮影後は URL から ?recording=1 を外すだけで通常操作に戻る。

import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, Suspense } from 'react';
import { words, WordGenre, buildAttribution } from '@/data/words';

const PAPER   = '#faf7f1';
const INK     = 'rgba(40,34,26,0.86)';
const FAINT   = 'rgba(50,44,36,0.30)';
const FAINTER = 'rgba(50,44,36,0.18)';

function GenreWordsInner() {
  const params       = useParams();
  const searchParams = useSearchParams();
  const genre        = params.genre as WordGenre;
  const poems        = words.filter(w => w.genre === genre);

  // ── 録画モード: ?recording=1 で ON ────────────────────────────────────────
  const recordingMode = searchParams.get('recording') === '1';

  const [idx, setIdx] = useState(0);

  const poem         = poems[idx] ?? null;
  const isFirst      = idx === 0;
  const isLast       = idx === poems.length - 1;
  const attribution  = poem ? buildAttribution(poem) : null;
  const showStageLink = isLast && genre === 'novel';

  function goNext() { if (!isLast)  setIdx(i => i + 1); }
  function goPrev() { if (!isFirst) setIdx(i => i - 1); }

  // 録画モード時のページ全体クリックハンドラ
  function handlePageClick() {
    if (!recordingMode) return;
    if (!isLast) {
      goNext();
    } else if (genre === 'novel') {
      // 最後のページ（もう少し読む）でクリックしたら /stage/kimi-hoshi へ
      window.location.href = '/stage/kimi-hoshi';
    }
  }

  // ── 共通スタイル ────────────────────────────────────────────────────────────
  const poemText: React.CSSProperties = {
    writingMode: 'vertical-rl',
    textOrientation: 'mixed',
    fontFamily: "'Yu Mincho', '游明朝', 'YuMincho', 'Hiragino Mincho ProN', 'ヒラギノ明朝 ProN', var(--font-serif-jp), serif",
    fontWeight: 300,
    lineHeight: 2.6,
    letterSpacing: '0.20em',
    color: INK,
    margin: 0,
    whiteSpace: 'pre-wrap',
  };

  const navBtn = (disabled: boolean): React.CSSProperties => ({
    background: 'none', border: 'none', padding: '6px 10px',
    cursor: disabled ? 'default' : 'pointer',
    fontSize: '11px',
    color: disabled ? FAINTER : FAINT,
    fontFamily: 'Georgia, serif',
    transition: 'color 0.2s',
  });

  return (
    <div
      onClick={handlePageClick}
      style={{
        position: 'fixed', inset: 0,
        background: '#ede9e0',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        cursor: recordingMode && !isLast ? 'pointer' : 'default',
      }}
    >
      {/* 光 */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 38%, rgba(255,252,248,0.55) 0%, transparent 66%)',
      }} />

      {/* 戻るリンク */}
      <div
        style={{ position: 'absolute', top: '28px', left: 'clamp(20px, 5vw, 40px)', zIndex: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <Link
          href="/words"
          style={{
            fontSize: '10px', color: 'rgba(50,44,36,0.36)', textDecoration: 'none',
            letterSpacing: '0.12em', fontFamily: 'Georgia, serif',
            transition: 'color 0.2s ease', display: 'inline-block', padding: '6px 0',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(50,44,36,0.76)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(50,44,36,0.36)')}
        >
          ← Words
        </Link>
      </div>

      {/* ══════════════════════════════════════════════
          SP: 1ページ
      ══════════════════════════════════════════════ */}
      <div className="book-sp">
        <div style={{
          width: 'min(84vw, 310px)',
          height: 'min(128vw, 472px)',
          background: PAPER,
          position: 'relative',
          borderRadius: '2px',
          boxShadow: '-3px 10px 32px rgba(50,40,28,0.18), 3px 4px 14px rgba(50,40,28,0.10)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '44px 32px 52px',
        }}>
          {/* 左端の綴じ影 */}
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: '8px',
            background: 'linear-gradient(to right, rgba(60,50,38,0.14), transparent)',
            borderRadius: '2px 0 0 2px',
          }} />

          {/* 詩：SP はやや小さめのフォントで余白を確保 */}
          {poem && (
            <p key={idx} style={{ ...poemText, fontSize: 'clamp(14px, 4.2vw, 17px)' }}>
              {poem.text}
            </p>
          )}

          {/* 属性 */}
          {attribution && (
            <div style={{
              position: 'absolute', bottom: '48px', right: '22px',
              fontSize: '9px', color: 'rgba(50,44,36,0.34)',
              fontFamily: "'Yu Mincho', '游明朝', 'Hiragino Mincho ProN', serif",
              letterSpacing: '0.10em',
            }}>
              ── {attribution}
            </div>
          )}

          {/* ナビゲーション */}
          <div
            style={{
              position: 'absolute', bottom: '16px', left: 0, right: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 18px',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button onClick={goPrev} style={navBtn(isFirst)}>←</button>
            <span style={{ fontSize: '8px', color: FAINTER, fontFamily: 'Georgia, serif', letterSpacing: '0.08em' }}>
              {idx + 1} / {poems.length}
            </span>
            {showStageLink ? (
              <Link href="/stage/kimi-hoshi" style={{
                fontSize: '9px', color: 'rgba(50,44,36,0.34)', textDecoration: 'none',
                fontFamily: "'Yu Mincho', '游明朝', 'Hiragino Mincho ProN', serif",
                letterSpacing: '0.10em', transition: 'color 0.2s ease',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(50,44,36,0.70)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(50,44,36,0.34)')}
              >
                もう少し読む →
              </Link>
            ) : (
              <button onClick={goNext} style={navBtn(isLast)}>→</button>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          PC: 見開き
      ══════════════════════════════════════════════ */}
      <div className="book-pc">
        <div style={{ display: 'flex', alignItems: 'stretch' }}>

          {/* 左ページ（詩） */}
          <div style={{
            width: 'min(30vw, 300px)',
            height: 'min(50vh, 448px)',
            background: PAPER,
            position: 'relative',
            borderRadius: '2px 0 0 2px',
            boxShadow: '-4px 12px 40px rgba(50,40,28,0.16)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            // 上下の余白を広めに取り、縦組みが呼吸できるようにする
            padding: '56px 44px',
          }}>
            {/* 左端の背表紙ライン */}
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '8px',
              background: 'linear-gradient(to right, rgba(60,50,38,0.16), transparent)',
              borderRadius: '2px 0 0 2px',
            }} />
            {/* 右端の綴じ影（ガター側） */}
            <div style={{
              position: 'absolute', right: 0, top: 0, bottom: 0, width: '24px',
              background: 'linear-gradient(to left, rgba(60,50,38,0.10), transparent)',
            }} />

            {/* 詩：PC はフォントをゆったり */}
            {poem && (
              <p key={idx} style={{ ...poemText, fontSize: 'clamp(15px, 1.8vw, 19px)' }}>
                {poem.text}
              </p>
            )}

            {/* ページ番号 */}
            <div style={{
              position: 'absolute', bottom: '18px', left: '24px',
              fontSize: '8px', color: FAINTER, fontFamily: 'Georgia, serif',
            }}>
              {idx * 2 + 1}
            </div>
          </div>

          {/* 綴じ目（ガター） */}
          <div style={{
            width: '18px',
            background: 'linear-gradient(to right, rgba(55,45,32,0.18) 0%, rgba(55,45,32,0.05) 45%, rgba(55,45,32,0.13) 100%)',
            boxShadow: 'inset -1px 0 3px rgba(0,0,0,0.06), inset 1px 0 3px rgba(0,0,0,0.06)',
          }} />

          {/* 右ページ（属性・ナビ） */}
          <div style={{
            width: 'min(30vw, 300px)',
            height: 'min(50vh, 448px)',
            background: PAPER,
            position: 'relative',
            borderRadius: '0 2px 2px 0',
            boxShadow: '4px 12px 40px rgba(50,40,28,0.16)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '56px 40px',
            gap: '28px',
          }}>
            {/* 左端の綴じ影 */}
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '24px',
              background: 'linear-gradient(to right, rgba(60,50,38,0.09), transparent)',
            }} />
            {/* 右端の小口 */}
            <div style={{
              position: 'absolute', right: 0, top: 0, bottom: 0, width: '4px',
              background: 'linear-gradient(to left, rgba(235,228,215,0.60), rgba(235,228,215,0.20))',
              borderRadius: '0 2px 2px 0',
            }} />

            {/* 属性 */}
            {attribution && (
              <div style={{
                fontSize: '10px', color: 'rgba(50,44,36,0.34)',
                fontFamily: "'Yu Mincho', '游明朝', 'Hiragino Mincho ProN', serif",
                letterSpacing: '0.14em', lineHeight: 2.0, textAlign: 'center',
              }}>
                ── {attribution}
              </div>
            )}

            {/* ナビゲーション */}
            <div
              style={{ display: 'flex', gap: '20px', alignItems: 'center' }}
              onClick={e => e.stopPropagation()}
            >
              <button onClick={goPrev} style={navBtn(isFirst)}>←</button>
              <span style={{ fontSize: '8px', color: FAINTER, fontFamily: 'Georgia, serif', letterSpacing: '0.08em' }}>
                {idx + 1} / {poems.length}
              </span>
              <button onClick={goNext} style={navBtn(isLast)}>→</button>
            </div>

            {/* もう少し読む */}
            {showStageLink && (
              <Link
                href="/stage/kimi-hoshi"
                onClick={e => e.stopPropagation()}
                style={{
                  fontSize: '10px', color: 'rgba(50,44,36,0.32)', textDecoration: 'none',
                  fontFamily: "'Yu Mincho', '游明朝', 'Hiragino Mincho ProN', serif",
                  letterSpacing: '0.12em', transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(50,44,36,0.70)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(50,44,36,0.32)')}
              >
                ── もう少し読む
              </Link>
            )}

            {/* ページ番号 */}
            <div style={{
              position: 'absolute', bottom: '18px', right: '24px',
              fontSize: '8px', color: FAINTER, fontFamily: 'Georgia, serif',
            }}>
              {idx * 2 + 2}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .book-sp { display: flex; }
        .book-pc { display: none; }
        @media (min-width: 768px) {
          .book-sp { display: none; }
          .book-pc { display: flex; }
        }
      `}</style>
    </div>
  );
}

export default function GenreWordsPage() {
  return (
    <Suspense>
      <GenreWordsInner />
    </Suspense>
  );
}
