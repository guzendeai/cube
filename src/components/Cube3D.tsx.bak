'use client';

// src/components/Cube3D.tsx
import { useState, useRef, useEffect, useCallback } from 'react';
import { ContentItem } from '@/data/contents';
import { FaceId, FACE_IDS, OPPOSITE_FACE, ContentQueue } from '@/lib/cubeLogic';
import CubeFace from './CubeFace';

type Cube3DProps = {
  onFaceClick: (content: ContentItem) => void;
  size?: number;
};

function getFaceTransforms(cubeSize: number): Record<FaceId, string> {
  const half = cubeSize / 2;
  return {
    front:  `rotateY(0deg)   translateZ(${half}px)`,
    back:   `rotateY(180deg) translateZ(${half}px)`,
    left:   `rotateY(-90deg) translateZ(${half}px)`,
    right:  `rotateY(90deg)  translateZ(${half}px)`,
    top:    `rotateX(90deg)  translateZ(${half}px)`,
    bottom: `rotateX(-90deg) translateZ(${half}px)`,
  };
}

// どの回転角でどの面が正面に来るか判定
function getPrimaryFace(rotX: number, rotY: number): FaceId {
  const normX = ((rotX % 360) + 360) % 360;
  const normY = ((rotY % 360) + 360) % 360;

  // X軸回転が支配的な場合（上下）
  if (normX >= 45 && normX < 135) return 'bottom';
  if (normX >= 225 && normX < 315) return 'top';

  // Y軸回転
  if (normY >= 315 || normY < 45) return 'front';
  if (normY >= 45 && normY < 135) return 'left';
  if (normY >= 135 && normY < 225) return 'back';
  if (normY >= 225 && normY < 315) return 'right';

  return 'front';
}

export default function Cube3D({ onFaceClick, size = 340 }: Cube3DProps) {
  const CUBE_SIZE = size;
  const FACE_TRANSFORMS = getFaceTransforms(CUBE_SIZE);
  const [rotX, setRotX] = useState(-18);
  const [rotY, setRotY] = useState(28);
  const [faceContents, setFaceContents] = useState<Record<FaceId, ContentItem> | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const queueRef = useRef<ContentQueue>(new ContentQueue());
  const prevPrimaryFaceRef = useRef<FaceId>('front');
  const dragStartRef = useRef({ x: 0, y: 0, rotX: 0, rotY: 0 });
  const lastDragRef = useRef({ x: 0, y: 0, time: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 初期コンテンツをセット
  useEffect(() => {
    const initialContents = queueRef.current.getInitialContents();
    setFaceContents(initialContents);
    prevPrimaryFaceRef.current = getPrimaryFace(rotX, rotY);
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  // 回転後、見えなくなった面にコンテンツを割り当てる
  const updateHiddenFace = useCallback((newRotX: number, newRotY: number) => {
    const currentPrimary = getPrimaryFace(newRotX, newRotY);
    if (currentPrimary !== prevPrimaryFaceRef.current) {
      const hiddenFace = OPPOSITE_FACE[currentPrimary];
      setFaceContents(prev => {
        if (!prev) return prev;
        const newContent = queueRef.current.getNext();
        return { ...prev, [hiddenFace]: newContent };
      });
      prevPrimaryFaceRef.current = currentPrimary;
    }
  }, []);

  // 慣性アニメーション
  const runInertia = useCallback(() => {
    const decay = 0.92;
    velocityRef.current.x *= decay;
    velocityRef.current.y *= decay;

    if (Math.abs(velocityRef.current.x) < 0.05 && Math.abs(velocityRef.current.y) < 0.05) {
      setIsAnimating(false);
      return;
    }

    setRotX(prev => {
      const next = prev + velocityRef.current.x;
      return next;
    });
    setRotY(prev => {
      const next = prev + velocityRef.current.y;
      updateHiddenFace(rotX + velocityRef.current.x, rotY + velocityRef.current.y);
      return next;
    });

    animFrameRef.current = requestAnimationFrame(runInertia);
  }, [rotX, rotY, updateHiddenFace]);

  // マウスイベント
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      setIsAnimating(false);
    }
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, rotX, rotY };
    lastDragRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    velocityRef.current = { x: 0, y: 0 };
  }, [rotX, rotY]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    
    const newRotY = dragStartRef.current.rotY + dx * 0.4;
    const newRotX = dragStartRef.current.rotX - dy * 0.4; // 符号反転: 上スワイプ→上面が見える
    
    // 速度計算
    const now = Date.now();
    const dt = now - lastDragRef.current.time;
    if (dt > 0) {
      velocityRef.current.y = (e.clientX - lastDragRef.current.x) * 0.4 * (16 / dt);
      velocityRef.current.x = -(e.clientY - lastDragRef.current.y) * 0.4 * (16 / dt); // 符号反転
    }
    lastDragRef.current = { x: e.clientX, y: e.clientY, time: now };

    setRotX(newRotX);
    setRotY(newRotY);
    updateHiddenFace(newRotX, newRotY);
  }, [isDragging, updateHiddenFace]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // 慣性
    if (Math.abs(velocityRef.current.x) > 0.3 || Math.abs(velocityRef.current.y) > 0.3) {
      setIsAnimating(true);
      animFrameRef.current = requestAnimationFrame(runInertia);
    }
  }, [isDragging, runInertia]);

  // タッチイベント
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      setIsAnimating(false);
    }
    const touch = e.touches[0];
    setIsDragging(true);
    dragStartRef.current = { x: touch.clientX, y: touch.clientY, rotX, rotY };
    lastDragRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    velocityRef.current = { x: 0, y: 0 };
  }, [rotX, rotY]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartRef.current.x;
    const dy = touch.clientY - dragStartRef.current.y;
    
    const newRotY = dragStartRef.current.rotY + dx * 0.5;
    const newRotX = dragStartRef.current.rotX - dy * 0.5; // 符号反転: 上スワイプ→上面が見える

    const now = Date.now();
    const dt = now - lastDragRef.current.time;
    if (dt > 0) {
      velocityRef.current.y = (touch.clientX - lastDragRef.current.x) * 0.5 * (16 / dt);
      velocityRef.current.x = -(touch.clientY - lastDragRef.current.y) * 0.5 * (16 / dt); // 符号反転
    }
    lastDragRef.current = { x: touch.clientX, y: touch.clientY, time: now };

    setRotX(newRotX);
    setRotY(newRotY);
    updateHiddenFace(newRotX, newRotY);
  }, [isDragging, updateHiddenFace]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (Math.abs(velocityRef.current.x) > 0.5 || Math.abs(velocityRef.current.y) > 0.5) {
      setIsAnimating(true);
      animFrameRef.current = requestAnimationFrame(runInertia);
    }
  }, [isDragging, runInertia]);

  // グローバルイベントリスナー登録
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd);
    return () => {
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchMove, handleTouchEnd]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  if (!faceContents) return null;

  const currentPrimary = getPrimaryFace(rotX, rotY);

  return (
    <div
      ref={containerRef}
      style={{
        width: CUBE_SIZE,
        height: CUBE_SIZE,
        perspective: `${CUBE_SIZE * 2.8}px`,
        perspectiveOrigin: '50% 45%',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transition: isDragging || isAnimating ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          willChange: 'transform',
        }}
      >
        {FACE_IDS.map((faceId) => {
          const isPrimary = faceId === currentPrimary;
          // 各面に自然光由来のシェーディング（黒でなく青緑灰で落とす）
          const shading: Record<FaceId, string> = {
            front:  'rgba(255,255,255,0.0)',
            back:   'rgba(40,55,48,0.12)',
            left:   'rgba(40,55,48,0.05)',
            right:  'rgba(40,55,48,0.03)',
            top:    'rgba(220,230,225,0.05)',
            bottom: 'rgba(40,55,48,0.08)',
          };
          return (
            <div
              key={faceId}
              style={{
                position: 'absolute',
                width: `${CUBE_SIZE}px`,
                height: `${CUBE_SIZE}px`,
                transform: FACE_TRANSFORMS[faceId],
              }}
            >
              <CubeFace
                content={faceContents[faceId]}
                faceId={faceId}
                isVisible={isPrimary}
                onClick={onFaceClick}
              />
              {/* シェーディングオーバーレイ */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: shading[faceId],
                  pointerEvents: 'none',
                  borderRadius: '3px',
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
