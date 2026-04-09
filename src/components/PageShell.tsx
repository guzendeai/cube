'use client';

// src/components/PageShell.tsx
// 下層ページ共通の背景レイヤー。
// トップページの大気グラデーションの静止版を提供する。
// ヘッダーやナビは含めず、背景だけを担当する薄いラッパー。

type PageShellProps = {
  children: React.ReactNode;
};

export default function PageShell({ children }: PageShellProps) {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'var(--air-bg)',
        overflow: 'hidden',
      }}
    >
      {/* 上部: 青緑の霞 */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: `radial-gradient(ellipse 80% 50% at 50% -5%,
            rgba(190,210,205,0.18) 0%,
            transparent 65%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      {/* 下部: 砂色の温もり */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: `radial-gradient(ellipse 60% 35% at 50% 108%,
            rgba(210,205,185,0.14) 0%,
            transparent 60%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
