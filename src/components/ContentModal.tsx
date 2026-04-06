'use client';

// src/components/ContentModal.tsx
import { useEffect } from 'react';
import { ContentItem, categoryLabels, categoryColors } from '@/data/contents';

type ContentModalProps = {
  content: ContentItem | null;
  onClose: () => void;
};

export default function ContentModal({ content, onClose }: ContentModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (content) {
      window.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [content, onClose]);

  if (!content) return null;

  const categoryColor = categoryColors[content.category];
  const label = categoryLabels[content.category];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
      onClick={onClose}
    >
      {/* ── オーバーレイ：霧のように薄く ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          // 完全な黒ではなく、深い青緑灰で覆う
          background: 'rgba(28, 35, 32, 0.60)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          animation: 'fadeIn 0.22s ease',
        }}
      />

      {/* ── モーダル本体 ── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '400px',
          background: 'var(--air-bg-warm)',
          borderRadius: '3px',
          overflow: 'hidden',
          // 影：重くならないよう薄く・広く
          boxShadow: '0 20px 70px rgba(40,60,45,0.18), 0 4px 16px rgba(40,60,45,0.08)',
          animation: 'slideUp 0.26s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          border: '1px solid rgba(150,170,155,0.12)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 上部アクセントライン：霞のような薄さ */}
        <div
          style={{
            height: '2px',
            background: `linear-gradient(90deg, ${categoryColor}60, ${categoryColor}10)`,
          }}
        />

        {/* ── 画像エリア ── */}
        <div
          style={{
            height: '200px',
            // 霞んだ光のグラデーション
            background: `linear-gradient(150deg,
              ${content.accentColor}18 0%,
              ${content.accentColor}40 60%,
              ${content.accentColor}28 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* 光の差し込み */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(ellipse 55% 45% at 70% 15%,
                rgba(255,255,255,0.15) 0%, transparent 65%)`,
              pointerEvents: 'none',
            }}
          />

          <div style={{
            fontSize: '60px',
            opacity: 0.25,
            filter: 'saturate(0.5)',
            position: 'relative',
            zIndex: 1,
          }}>
            {getCategoryIcon(content.category)}
          </div>

          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              width: '28px',
              height: '28px',
              background: 'var(--air-bg-glass)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              border: '1px solid rgba(150,170,155,0.15)',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: 'var(--air-ink-mid)',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.95)')}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--air-bg-glass)')}
          >
            ✕
          </button>
        </div>

        {/* ── コンテンツ情報 ── */}
        <div style={{ padding: '24px 26px 28px' }}>
          {/* カテゴリ */}
          <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '9px',
                letterSpacing: '0.14em',
                color: categoryColor,
                fontWeight: 500,
                textTransform: 'uppercase',
                fontFamily: 'Georgia, serif',
              }}
            >
              {label}
            </span>
            <span style={{
              width: '20px',
              height: '1px',
              background: categoryColor,
              opacity: 0.3,
              display: 'block',
              flexShrink: 0,
            }} />
          </div>

          {/* タイトル */}
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 500,
              color: 'var(--air-ink)',
              lineHeight: 1.45,
              margin: '0 0 14px',
              fontFamily: "'Noto Serif JP', Georgia, serif",
              letterSpacing: '0.03em',
            }}
          >
            {content.title}
          </h2>

          {/* 説明文 */}
          <p
            style={{
              fontSize: '13px',
              color: 'var(--air-ink-mid)',
              lineHeight: 1.85,
              margin: '0 0 20px',
              fontFamily: "'Noto Sans JP', sans-serif",
            }}
          >
            {content.description}
          </p>

          {/* タグ */}
          {content.tags && content.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '22px' }}>
              {content.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    fontSize: '10px',
                    color: 'var(--air-ink-light)',
                    background: 'rgba(130,155,140,0.08)',
                    border: '1px solid rgba(130,155,140,0.14)',
                    padding: '2px 9px',
                    borderRadius: '10px',
                    fontFamily: "'Noto Sans JP', sans-serif",
                    letterSpacing: '0.04em',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* CTAボタン */}
          <a
            href={content.url}
            target={content.isExternal ? '_blank' : '_self'}
            rel={content.isExternal ? 'noopener noreferrer' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '13px',
              // ボタン色：深い青緑灰（海の底の静かな色）
              background: '#2c3830',
              color: 'rgba(240,242,238,0.90)',
              textDecoration: 'none',
              fontSize: '12px',
              letterSpacing: '0.10em',
              fontFamily: 'Georgia, serif',
              borderRadius: '2px',
              transition: 'background 0.22s ease',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = '#3a4840')}
            onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = '#2c3830')}
          >
            {content.isExternal ? '外部サイトへ' : '詳しく見る'}
            <span style={{ fontSize: '14px', opacity: 0.7 }}>
              {content.isExternal ? '↗' : '→'}
            </span>
          </a>
        </div>
      </div>
    </div>
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
