'use client';

// src/app/words/[genre]/page.tsx
// ジャンル別の言葉一覧ページ。
// 縦書き・余白・タイポグラフィを主役にした静かな組版。

import { useParams } from 'next/navigation';
import Link from 'next/link';
import PageShell from '@/components/PageShell';
import {
  words,
  WordItem,
  WordGenre,
  genreLabels,
  buildAttribution,
} from '@/data/words';

export default function GenreWordsPage() {
  const params = useParams();
  const genre = params.genre as WordGenre;
  const label = genreLabels[genre] ?? genre;
  const filtered = words.filter(w => w.genre === genre);

  return (
    <PageShell>
      <div style={{ minHeight: '100vh', background: 'transparent' }}>

        {/* ── ヘッダー ── */}
        <div
          style={{
            borderBottom: '1px solid var(--air-border)',
            padding: '36px clamp(16px, 5vw, 40px) 28px',
            background: 'var(--air-bg-glass)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <div
            style={{
              maxWidth: '640px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Link
              href="/words"
              style={{
                fontSize: '10px',
                color: 'var(--air-ink-light)',
                textDecoration: 'none',
                letterSpacing: '0.12em',
                fontFamily: 'Georgia, serif',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 0',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--air-ink)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--air-ink-light)')}
            >
              ← {/* 言葉 */}Words
            </Link>

            <h1
              style={{
                fontFamily: "'Yu Mincho', '游明朝', 'YuMincho', 'Hiragino Mincho ProN', 'ヒラギノ明朝 ProN', var(--font-serif-jp), serif",
                fontSize: '14px',
                fontWeight: 300,
                color: 'var(--air-ink-light)',
                letterSpacing: '0.20em',
                margin: 0,
              }}
            >
              {label}
            </h1>
          </div>
        </div>

        {/* ── 言葉リスト ── */}
        <div
          style={{
            maxWidth: '640px',
            margin: '0 auto',
            padding: '96px clamp(16px, 5vw, 48px) 160px',
          }}
        >
          {filtered.length === 0 ? (
            <p
              style={{
                textAlign: 'center',
                fontSize: '11px',
                color: 'var(--air-ink-faint)',
                fontFamily: 'Georgia, serif',
                letterSpacing: '0.12em',
              }}
            >
              —
            </p>
          ) : (
            filtered.map((word, index) => (
              <WordEntry
                key={word.id}
                word={word}
                isLast={index === filtered.length - 1}
              />
            ))
          )}
        </div>

      </div>
    </PageShell>
  );
}

function WordEntry({ word, isLast }: { word: WordItem; isLast: boolean }) {
  const attribution = buildAttribution(word);

  return (
    <div
      style={{
        paddingBottom: isLast ? 0 : '88px',
        marginBottom: isLast ? 0 : '88px',
        borderBottom: isLast ? 'none' : '1px solid var(--air-border-light)',
      }}
    >
      {/* ── 縦書きテキスト：中央寄せ ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: attribution ? '28px' : 0,
        }}
      >
        <p
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            fontFamily: "'Yu Mincho', '游明朝', 'YuMincho', 'Hiragino Mincho ProN', 'ヒラギノ明朝 ProN', var(--font-serif-jp), serif",
            fontSize: 'clamp(17px, 4.5vw, 21px)',
            fontWeight: 300,
            lineHeight: 2.4,
            letterSpacing: '0.15em',
            color: 'var(--air-ink)',
            margin: 0,
            maxHeight: '72vmax',
            whiteSpace: 'pre-wrap',
          }}
        >
          {word.text}
        </p>
      </div>

      {/* ── 属性（横書き・右寄せ）── */}
      {attribution && (
        <div
          style={{
            textAlign: 'right',
            fontSize: '10px',
            color: 'var(--air-ink-faint)',
            fontFamily: "'Yu Mincho', '游明朝', 'YuMincho', 'Hiragino Mincho ProN', 'ヒラギノ明朝 ProN', var(--font-serif-jp), serif",
            letterSpacing: '0.10em',
            lineHeight: 1.8,
          }}
        >
          ── {attribution}
        </div>
      )}
    </div>
  );
}
