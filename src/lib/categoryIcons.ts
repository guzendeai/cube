// src/lib/categoryIcons.ts

const icons: Record<string, string> = {
  note:     '✍',
  app:      '◻',
  link:     '⬡',
  photo:    '◈',
  video:    '▷',
  activity: '◎',
};

export function getCategoryIcon(category: string): string {
  return icons[category] ?? '○';
}
