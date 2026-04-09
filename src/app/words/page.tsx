'use client';

// src/app/words/page.tsx
// 「言葉」ジャンル一覧ページ。
// 装飾を抑え、ジャンル名だけを静かに並べる。

import Link from 'next/link';
import PageShell from '@/components/PageShell';
import { GENRES, genreLabels, WordGenre, words } from '@/data/words';

export default function WordsIndexPage() {
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
              href="/"
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
              ← もどる
            </Link>

            <h1
              style={{
                fontSize: '11px',
                fontWeight: 400,
                color: 'var(--air-ink-light)',
                letterSpacing: '0.22em',
                fontFamily: 'Georgia, serif',
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              Words
            </h1>
          </div>
        </div>

        {/* ── ジャンル一覧 ── */}
        <div
          style={{
            maxWidth: '640px',
            margin: '0 auto',
            padding: '80px clamp(16px, 5vw, 48px) 160px',
          }}
        >
          {GENRES.map((genre, index) => {
            const count = words.filter(w => w.genre === genre).length;
            const isLast = index === GENRES.length - 1;
            return (
              <GenreRow
                key={genre}
                genre={genre}
                count={count}
                isLast={isLast}
              />
            );
          })}
        </div>

      </div>
    </PageShell>
  );
}

function GenreRow({
  genre,
  count,
  isLast,
}: {
  genre: WordGenre;
  count: number;
  isLast: boolean;
}) {
  return (
    <>
      <Link
        href={`/words/${genre}`}
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          padding: '28px 0',
          textDecoration: 'none',
          color: 'var(--air-ink)',
          transition: 'color 0.2s ease',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.color = 'var(--air-ink-mid)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.color = 'var(--air-ink)';
        }}
      >
        <span
          style={{
            fontFamily: "'Yu Mincho', '游明朝', 'YuMincho', 'Hiragino Mincho ProN', 'ヒラギノ明朝 ProN', var(--font-serif-jp), serif",
            fontSize: 'clamp(20px, 5vw, 26px)',
            fontWeight: 300,
            letterSpacing: '0.18em',
          }}
        >
          {genreLabels[genre]}
        </span>
        <span
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: '10px',
            color: 'var(--air-ink-faint)',
            letterSpacing: '0.10em',
          }}
        >
          {count}
        </span>
      </Link>
      {!isLast && (
        <div style={{ height: '1px', background: 'var(--air-border-light)' }} />
      )}
    </>
  );
}
