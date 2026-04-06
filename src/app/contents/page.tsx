'use client';

// src/app/contents/page.tsx
import { useState } from 'react';
import Link from 'next/link';
import { contents, ContentItem, ContentCategory, categoryLabels, categoryColors } from '@/data/contents';

const CATEGORIES: ContentCategory[] = ['note', 'app', 'link', 'photo', 'video', 'activity'];

export default function ContentsPage() {
  const [activeCategory, setActiveCategory] = useState<ContentCategory | 'all'>('all');

  const filtered = activeCategory === 'all'
    ? contents
    : contents.filter(c => c.category === activeCategory);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--air-bg)', padding: '0' }}>

      {/* ── ヘッダー ── */}
      <div
        style={{
          borderBottom: '1px solid var(--air-border)',
          padding: '36px 40px 28px',
          background: 'var(--air-bg-glass)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '22px',
          }}>
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
                letterSpacing: '0.18em',
                fontFamily: 'Georgia, serif',
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              All Contents
            </h1>
          </div>

          {/* カテゴリフィルター */}
          <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
            <FilterButton
              label="すべて"
              isActive={activeCategory === 'all'}
              color="#6e7e72"
              onClick={() => setActiveCategory('all')}
            />
            {CATEGORIES.map(cat => (
              <FilterButton
                key={cat}
                label={categoryLabels[cat]}
                isActive={activeCategory === cat}
                color={categoryColors[cat]}
                onClick={() => setActiveCategory(cat)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── コンテンツグリッド ── */}
      <div style={{ maxWidth: '840px', margin: '0 auto', padding: '36px 40px 80px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
            gap: '16px',
          }}
        >
          {filtered.map(item => (
            <ContentCard key={item.id} content={item} />
          ))}
        </div>

        <div
          style={{
            marginTop: '56px',
            textAlign: 'center',
            fontSize: '10px',
            color: 'var(--air-ink-faint)',
            letterSpacing: '0.12em',
            fontFamily: 'Georgia, serif',
          }}
        >
          {filtered.length} items
        </div>
      </div>
    </div>
  );
}

function FilterButton({
  label,
  isActive,
  color,
  onClick,
}: {
  label: string;
  isActive: boolean;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 13px',
        fontSize: '10px',
        letterSpacing: '0.06em',
        fontFamily: "'Noto Sans JP', sans-serif",
        border: `1px solid ${isActive ? color + '80' : 'var(--air-border)'}`,
        background: isActive ? color + '18' : 'transparent',
        color: isActive ? color : 'var(--air-ink-light)',
        borderRadius: '20px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {label}
    </button>
  );
}

function ContentCard({ content }: { content: ContentItem }) {
  const categoryColor = categoryColors[content.category];
  const label = categoryLabels[content.category];

  return (
    <a
      href={content.url}
      target={content.isExternal ? '_blank' : '_self'}
      rel={content.isExternal ? 'noopener noreferrer' : undefined}
      style={{
        display: 'block',
        background: 'var(--air-bg-warm)',
        borderRadius: '3px',
        overflow: 'hidden',
        textDecoration: 'none',
        border: '1px solid var(--air-border)',
        boxShadow: 'var(--air-shadow-sm)',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--air-shadow-md)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--air-shadow-sm)';
      }}
    >
      {/* サムネイルエリア */}
      <div
        style={{
          height: '130px',
          background: `linear-gradient(150deg, ${content.accentColor}15 0%, ${content.accentColor}35 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 光の差し込み */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 60% 50% at 70% 20%,
            rgba(255,255,255,0.14) 0%, transparent 65%)`,
          pointerEvents: 'none',
        }} />

        <div style={{ fontSize: '36px', opacity: 0.22, filter: 'saturate(0.5)' }}>
          {getCategoryIcon(content.category)}
        </div>

        {/* カテゴリアクセントライン */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '2px',
            background: `linear-gradient(90deg, ${categoryColor}50, ${categoryColor}10)`,
          }}
        />
      </div>

      {/* テキストエリア */}
      <div style={{ padding: '14px 15px 15px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '7px',
        }}>
          <span style={{
            fontSize: '9px',
            color: categoryColor,
            fontWeight: 500,
            letterSpacing: '0.10em',
            fontFamily: 'Georgia, serif',
            textTransform: 'uppercase',
          }}>
            {label}
          </span>
          {content.isExternal && (
            <span style={{ fontSize: '9px', color: 'var(--air-ink-faint)', marginLeft: 'auto' }}>↗</span>
          )}
        </div>
        <h3 style={{
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--air-ink)',
          margin: '0 0 7px',
          lineHeight: 1.45,
          fontFamily: "'Noto Serif JP', Georgia, serif",
          letterSpacing: '0.02em',
        }}>
          {content.title}
        </h3>
        <p style={{
          fontSize: '10.5px',
          color: 'var(--air-ink-mid)',
          lineHeight: 1.65,
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          fontFamily: "'Noto Sans JP', sans-serif",
        }}>
          {content.description}
        </p>
      </div>
    </a>
  );
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    note: '✍',
    app: '◻',
    link: '⬡',
    photo: '◈',
    video: '▷',
    activity: '◎',
  };
  return icons[category] ?? '○';
}
