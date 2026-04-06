// src/lib/cubeLogic.ts
// 立方体の面管理とコンテンツ割り当てロジック

import { ContentItem, contents } from '@/data/contents';

export type FaceId = 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';

export const FACE_IDS: FaceId[] = ['front', 'back', 'left', 'right', 'top', 'bottom'];

// 反対面のマップ（ある面が見えなくなったら反対面を更新する）
export const OPPOSITE_FACE: Record<FaceId, FaceId> = {
  front: 'back',
  back: 'front',
  left: 'right',
  right: 'left',
  top: 'bottom',
  bottom: 'top',
};

// 現在の回転角度からどの面が「正面」か判定
export function getVisibleFaces(rotX: number, rotY: number): FaceId[] {
  const visible: FaceId[] = [];
  
  const normX = ((rotX % 360) + 360) % 360;
  const normY = ((rotY % 360) + 360) % 360;

  // Y軸回転で左右面の可視性
  if (normY >= 315 || normY < 45) visible.push('front');
  if (normY >= 45 && normY < 135) visible.push('right');
  if (normY >= 135 && normY < 225) visible.push('back');
  if (normY >= 225 && normY < 315) visible.push('left');

  // X軸回転で上下面の可視性
  if (normX >= 315 || normX < 45) {/* normal */}
  else if (normX >= 45 && normX < 135) visible.push('top');
  else if (normX >= 135 && normX < 225) {/* upside down */}
  else if (normX >= 225 && normX < 315) visible.push('bottom');

  return visible;
}

// シャッフルされたコンテンツキューを管理するクラス
export class ContentQueue {
  private queue: ContentItem[];
  private recentlyShown: Set<string>;
  private maxRecent: number;

  constructor() {
    this.recentlyShown = new Set();
    this.maxRecent = 6; // 立方体の6面分は最近表示したとみなす
    this.queue = this.createShuffledQueue();
  }

  private createShuffledQueue(): ContentItem[] {
    return [...contents].sort(() => Math.random() - 0.5);
  }

  // 次のコンテンツを取得（最近表示されたものは除く）
  getNext(): ContentItem {
    // キューが空になったらリシャッフル
    if (this.queue.length === 0) {
      this.queue = this.createShuffledQueue();
      this.recentlyShown.clear();
    }

    // 最近表示していないコンテンツを探す
    let attempts = 0;
    while (attempts < this.queue.length) {
      const candidate = this.queue[attempts];
      if (!this.recentlyShown.has(candidate.id)) {
        // このアイテムを取り出す
        this.queue.splice(attempts, 1);
        this.recentlyShown.add(candidate.id);
        
        // 古いものをrecentlyShownから削除
        if (this.recentlyShown.size > this.maxRecent) {
          const firstItem = this.recentlyShown.values().next().value;
          if (firstItem) this.recentlyShown.delete(firstItem);
        }
        return candidate;
      }
      attempts++;
    }

    // どうしても見つからない場合はキューの先頭を返す
    const fallback = this.queue.shift() ?? contents[0];
    this.recentlyShown.add(fallback.id);
    return fallback;
  }

  // 6面分の初期コンテンツを一括取得
  getInitialContents(): Record<FaceId, ContentItem> {
    const result = {} as Record<FaceId, ContentItem>;
    for (const faceId of FACE_IDS) {
      result[faceId] = this.getNext();
    }
    return result;
  }
}
