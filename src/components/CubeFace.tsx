'use client';

// src/components/CubeFace.tsx
import { ContentItem, categoryLabels, categoryColors } from '@/data/contents';

type CubeFaceProps = {
  content: ContentItem;
  faceId: string;
  isVisible: boolean;
  onClick: (content: ContentItem) => void;
};

export default function CubeFace({ content, isVisible, onClick }: CubeFaceProps) {
  const categoryColor = categoryColors[content.category];
  const label = categoryLabels[content.category];

  return (
    <div
      className="cube-face"
      onClick={() => isVisible && onClick(content)}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        cursor: isVisible ? 'pointer' : 'default',
        overflow: 'hidden',
        borderRadius: '2px',
        // カードの地色：白磁に空気をほんの少し混ぜた色
        background: 'var(--air-bg-warm)',
        backfaceVisibility: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── 上部アクセントライン：霞のような薄さ ── */}
      <div
        style={{
          height: '2px',
          background: `linear-gradient(90deg, ${categoryColor}55 0%, ${categoryColor}10 100%)`,
          flexShrink: 0,
        }}
      />

      {/* ── 画像エリア（上半分） ── */}
      <div
        style={{
          flex: '0 0 54%',
          position: 'relative',
          // グラデーション：彩度を落として霞感を出す
          background: `linear-gradient(150deg, ${content.accentColor}18 0%, ${content.accentColor}38 100%)`,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* 光の滲み：右上から差し込む薄い光 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse 60% 50% at 75% 20%,
              rgba(255,255,255,0.18) 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        {/* カテゴリアイコン */}
        <div
          style={{
            fontSize: 'clamp(34px, 9vw, 48px)',
            // 彩度を落とした有機的な印象
            opacity: 0.22,
            userSelect: 'none',
            position: 'relative',
            zIndex: 1,
            lineHeight: 1,
            filter: 'saturate(0.6)',
          }}
        >
          {getCategoryIcon(content.category)}
        </div>

        {/* カテゴリラベル（右下）：薄く・小さく */}
        <div
          style={{
            position: 'absolute',
            bottom: '9px',
            right: '11px',
            fontSize: '8px',
            letterSpacing: '0.12em',
            color: categoryColor,
            fontWeight: 500,
            textTransform: 'uppercase',
            fontFamily: 'Georgia, serif',
            opacity: 0.65,
          }}
        >
          {label}
        </div>
      </div>

      {/* ── テキストエリア（下半分） ── */}
      <div
        style={{
          flex: 1,
          padding: '13px 15px 11px',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          background: 'var(--air-bg-warm)',
          position: 'relative',
        }}
      >
        {/* タイトル */}
        <h3
          style={{
            fontSize: 'clamp(11px, 2.8vw, 14px)',
            fontWeight: 500,
            // テキスト色：インクに空気を含ませた色
            color: 'var(--air-ink)',
            lineHeight: 1.45,
            margin: 0,
            fontFamily: "'Noto Serif JP', Georgia, serif",
            letterSpacing: '0.03em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {content.title}
        </h3>

        {/* 説明文 */}
        <p
          style={{
            fontSize: 'clamp(9px, 2.2vw, 10.5px)',
            color: 'var(--air-ink-mid)',
            lineHeight: 1.65,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontFamily: "'Noto Sans JP', sans-serif",
          }}
        >
          {content.description}
        </p>

        {/* タップヒント：霧の中の道標のように控えめに */}
        {isVisible && (
          <div
            style={{
              marginTop: 'auto',
              paddingTop: '4px',
              fontSize: '8.5px',
              color: 'var(--air-ink-faint)',
              letterSpacing: '0.1em',
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
            }}
          >
            tap to open →
          </div>
        )}
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
