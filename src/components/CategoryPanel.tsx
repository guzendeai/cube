'use client';

import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { CategoryId } from '@/types';
import {
  CATEGORIES,
  KOTOBA_DATA,
  ARUKI_DATA,
  ASOBI_DATA,
  NOTE_DATA,
  YOHAKU_DATA,
  NAGI_DATA,
} from '@/data/siteData';

type Props = {
  categoryId: CategoryId;
  onClose: () => void;
};

const linkStyle: CSSProperties = {
  fontSize: '11px',
  color: 'rgba(255,255,255,0.5)',
  border: '1px solid rgba(255,255,255,0.18)',
  padding: '5px 12px',
  textDecoration: 'none',
  letterSpacing: '0.08em',
  display: 'inline-block',
  fontFamily: 'var(--font-sans-jp), sans-serif',
};

// Near-invisible border — visual separation comes from background shading
const cardStyle: CSSProperties = {
  padding: '16px 18px',
  background: 'rgba(255,255,255,0.025)',
  borderRadius: '1px',
};

function KotobaContent() {
  const typeLabels: Record<string, string> = {
    book: '本', song: '歌', film: '映画', manga: '漫画', other: 'その他',
  };

  const [showing, setShowing] = useState(() =>
    [...KOTOBA_DATA].sort(() => Math.random() - 0.5).slice(0, 3)
  );

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {showing.map(item => (
          <div key={item.id} style={cardStyle}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)', marginBottom: '8px', letterSpacing: '0.1em' }}>
              {typeLabels[item.type]}　{item.work}　{item.author}
            </div>
            {item.showQuote && item.text ? (
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.78)', lineHeight: 2.1, letterSpacing: '0.06em' }}>
                {item.text}
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.08em' }}>
                一節はInstagramで
              </div>
            )}
            {item.memo && (
              <div style={{ marginTop: '10px', fontSize: '12px', color: 'rgba(255,255,255,0.32)', lineHeight: 1.8 }}>
                {item.memo}
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={() =>
          setShowing([...KOTOBA_DATA].sort(() => Math.random() - 0.5).slice(0, 3))
        }
        style={{
          marginTop: '16px',
          background: 'none',
          border: '1px solid rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.4)',
          cursor: 'pointer',
          fontSize: '12px',
          padding: '9px 0',
          letterSpacing: '0.1em',
          display: 'block',
          width: '100%',
          fontFamily: 'var(--font-sans-jp), sans-serif',
        }}
      >
        別の言葉に出会う
      </button>
    </div>
  );
}

function ArukiContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {ARUKI_DATA.map(item => (
        <div key={item.id} style={cardStyle}>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.72)', marginBottom: '5px', letterSpacing: '0.06em' }}>
            {item.title}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)', marginBottom: '8px' }}>
            {item.location}　{item.period}
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.9 }}>
            {item.caption}
          </div>
          <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {item.mapUrl && (
              <a href={item.mapUrl} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                この場所へ歩いてみる
              </a>
            )}
            {item.sellable && item.productUrl && (
              <a href={item.productUrl} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                かたちにして届ける
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function AsobitContent() {
  const statusLabels: Record<string, string> = {
    idea: '構想中', wip: '制作中', published: '公開中',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {ASOBI_DATA.map(item => (
        <div key={item.id} style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '7px' }}>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.72)', letterSpacing: '0.06em' }}>
              {item.title}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
              {statusLabels[item.status]}
            </div>
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.42)', lineHeight: 1.9, marginBottom: '10px' }}>
            {item.description}
          </div>
          {item.tech.length > 0 && (
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.22)', marginBottom: '10px', letterSpacing: '0.06em' }}>
              {item.tech.join('　')}
            </div>
          )}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {item.appStoreUrl && (
              <a href={item.appStoreUrl} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                App Storeで見る
              </a>
            )}
            {item.webUrl && (
              <a href={item.webUrl} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                触ってみる
              </a>
            )}
            {item.githubUrl && (
              <a href={item.githubUrl} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                GitHubを見る
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function NoteContent() {
  const typeLabels: Record<string, string> = {
    essay: 'エッセイ', story: '物語', magazine: 'マガジン', memo: '思考メモ', other: 'その他',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {NOTE_DATA.map(item => (
        <div key={item.id} style={cardStyle}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)', marginBottom: '6px', letterSpacing: '0.08em' }}>
            {typeLabels[item.type]}　{item.publishedAt}
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.72)', marginBottom: '7px', letterSpacing: '0.06em' }}>
            {item.title}
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.42)', lineHeight: 1.9, marginBottom: '12px' }}>
            {item.description}
          </div>
          <a href={item.noteUrl} target="_blank" rel="noopener noreferrer" style={linkStyle}>
            noteで読む
          </a>
        </div>
      ))}
    </div>
  );
}

function YohakuContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {YOHAKU_DATA.map(item => (
        <div key={item.id} style={cardStyle}>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.72)', marginBottom: '5px', letterSpacing: '0.06em' }}>
            {item.title}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)', marginBottom: '8px' }}>
            {item.location}　{item.period}
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.9 }}>
            {item.description}
          </div>
          {item.externalUrl && (
            <a href={item.externalUrl} target="_blank" rel="noopener noreferrer" style={{ ...linkStyle, marginTop: '12px' }}>
              詳しく見る
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

function NagiContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {NAGI_DATA.map(item => (
        <div key={item.id} style={cardStyle}>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.72)', marginBottom: '5px', letterSpacing: '0.06em' }}>
            {item.title}
          </div>
          {(item.location || item.period) && (
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)', marginBottom: '8px' }}>
              {[item.location, item.period].filter(Boolean).join('　')}
            </div>
          )}
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.9, marginBottom: '12px' }}>
            {item.description}
          </div>
          <a href={item.youtubeUrl} target="_blank" rel="noopener noreferrer" style={linkStyle}>
            YouTubeで見る
          </a>
        </div>
      ))}
    </div>
  );
}

function PanelContent({ categoryId }: { categoryId: CategoryId }) {
  switch (categoryId) {
    case 'kotoba': return <KotobaContent />;
    case 'aruki':  return <ArukiContent />;
    case 'asobi':  return <AsobitContent />;
    case 'note':   return <NoteContent />;
    case 'yohaku': return <YohakuContent />;
    case 'nagi':   return <NagiContent />;
  }
}

export default function CategoryPanel({ categoryId, onClose }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 40);
    return () => clearTimeout(t);
  }, []);

  const category = CATEGORIES.find(c => c.id === categoryId)!;

  const handleClose = () => {
    setVisible(false);
    // Dots scatter after panel fades out
    setTimeout(onClose, 300);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.30s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
      onClick={handleClose}
    >
      {/* No full-screen backdrop — frame dots on canvas remain visible */}

      {/* Panel */}
      <div
        className="panel-scroll"
        style={{
          position: 'relative',
          zIndex: 1,
          width: 'min(480px, calc(100vw - 32px))',
          maxHeight: '80dvh',
          overflowY: 'auto',
          background: 'rgba(6, 8, 18, 0.96)',
          border: '1px solid rgba(255,255,255,0.04)',
          borderRadius: '1px',
          padding: 'clamp(28px, 5vw, 44px) clamp(24px, 5vw, 40px)',
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(12px)',
          transition: 'transform 0.30s ease',
          boxShadow: '0 12px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="閉じる"
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.28)',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '6px 10px',
            lineHeight: 1,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.28)'; }}
        >
          ×
        </button>

        {/* Title */}
        <div
          style={{
            fontFamily: 'var(--font-serif-jp), serif',
            fontSize: 'clamp(20px, 4vw, 26px)',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.88)',
            letterSpacing: '0.12em',
            marginBottom: '14px',
          }}
        >
          {category.label}
        </div>

        {/* Description */}
        <div
          style={{
            fontFamily: 'var(--font-sans-jp), sans-serif',
            fontSize: '12px',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.38)',
            lineHeight: 2.1,
            letterSpacing: '0.08em',
            whiteSpace: 'pre-line',
            marginBottom: '28px',
          }}
        >
          {category.description}
        </div>

        {/* Separator */}
        <div
          style={{
            width: '20px',
            height: '1px',
            background: 'rgba(255,255,255,0.14)',
            marginBottom: '24px',
          }}
        />

        {/* Content */}
        <PanelContent categoryId={categoryId} />

        {/* Instagram */}
        {category.instagramLabel && (
          <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div
              style={{
                fontSize: '11px',
                color: 'rgba(255,255,255,0.28)',
                lineHeight: 1.9,
                marginBottom: '12px',
                letterSpacing: '0.07em',
                fontFamily: 'var(--font-sans-jp), sans-serif',
              }}
            >
              {category.instagramLabel}
            </div>
            {category.instagramUrl ? (
              <a
                href={category.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
              >
                {category.instagramButtonText}
              </a>
            ) : (
              <span
                style={{
                  ...linkStyle,
                  color: 'rgba(255,255,255,0.2)',
                  borderColor: 'rgba(255,255,255,0.08)',
                  cursor: 'default',
                }}
              >
                {category.instagramButtonText}（準備中）
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
