import type {
  CategoryId,
  CategoryMeta,
  KotobaItem,
  ArukiItem,
  AsobitItem,
  NoteItem,
  YohakuItem,
  NagiItem,
} from '@/types';

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'kotoba',
    label: '言葉',
    description: '本や歌や物語の中で、\n自分の中に残ってしまった一節たち。',
    instagramLabel: '日々出会った言葉は、Instagramにも少しずつ残しています。',
    instagramButtonText: 'Instagramで言葉を見る',
    instagramUrl: undefined,
  },
  {
    id: 'aruki',
    label: '歩いてみる',
    description: '光、風、海、街。\nいいなと思った場所へ、少し歩いてみる。',
    instagramLabel: '写真はInstagramにも少しずつ残しています。',
    instagramButtonText: 'Instagramで写真を見る',
    instagramUrl: undefined,
  },
  {
    id: 'asobi',
    label: '遊び',
    description: '役に立つかわからない。\nでも、思いついたから触ってみたくなったものたち。',
  },
  {
    id: 'note',
    label: 'note',
    description: '考えていたことが、\n少しだけ長い文章になった場所。',
  },
  {
    id: 'yohaku',
    label: '余白',
    description: '家でも、職場でも、学校でもない。\n誰かと何かが起きるための余白。',
  },
  {
    id: 'nagi',
    label: '凪',
    description: '見ているあいだ、\n心が少し凪いでくれたら。',
  },
];

export type { CategoryId, CategoryMeta, KotobaItem, ArukiItem, AsobitItem, NoteItem, YohakuItem, NagiItem };

export const KOTOBA_DATA: KotobaItem[] = [
  {
    id: 'k01',
    text: null,
    showQuote: false,
    work: '汝、星のごとく',
    author: '凪良ゆう',
    type: 'book',
    memo: '',
  },
  {
    id: 'k02',
    text: null,
    showQuote: false,
    work: '（あとで追加）',
    author: '（あとで追加）',
    type: 'song',
    memo: '',
  },
  {
    id: 'k03',
    text: null,
    showQuote: false,
    work: '（あとで追加）',
    author: '（あとで追加）',
    type: 'book',
    memo: '',
  },
];

export const ARUKI_DATA: ArukiItem[] = [
  {
    id: 'a01',
    title: '（あとで追加）',
    image: '',
    location: '（撮影場所）',
    period: '（撮影時期）',
    caption: '（キャプション）',
    sellable: false,
  },
  {
    id: 'a02',
    title: '（あとで追加）',
    image: '',
    location: '（撮影場所）',
    period: '（撮影時期）',
    caption: '（キャプション）',
    sellable: false,
  },
];

export const ASOBI_DATA: AsobitItem[] = [
  {
    id: 'as01',
    title: '（あとで追加）',
    description: '（説明）',
    status: 'published',
    tech: ['Swift', 'SwiftUI'],
    appStoreUrl: undefined,
  },
  {
    id: 'as02',
    title: '（あとで追加）',
    description: '（説明）',
    status: 'idea',
    tech: ['Next.js', 'TypeScript'],
  },
];

export const NOTE_DATA: NoteItem[] = [
  {
    id: 'nt01',
    title: '（あとで追加）',
    description: '（説明）',
    theme: '（テーマ）',
    publishedAt: '2024',
    noteUrl: 'https://note.com',
    type: 'essay',
  },
  {
    id: 'nt02',
    title: '（あとで追加）',
    description: '（説明）',
    theme: '（テーマ）',
    publishedAt: '2024',
    noteUrl: 'https://note.com',
    type: 'memo',
  },
];

export const YOHAKU_DATA: YohakuItem[] = [
  {
    id: 'y01',
    title: 'ノウド',
    location: '（場所）',
    period: '（時期）',
    description: '（どんな時間だったか）',
  },
  {
    id: 'y02',
    title: '子どもカフェ',
    location: '（場所）',
    period: '（時期）',
    description: '（どんな時間だったか）',
  },
];

export const NAGI_DATA: NagiItem[] = [
  {
    id: 'ng01',
    title: '（あとで追加）',
    description: '（説明）',
    youtubeUrl: 'https://www.youtube.com',
    location: '（撮影場所）',
    period: '（撮影時期）',
  },
  {
    id: 'ng02',
    title: '（あとで追加）',
    description: '（説明）',
    youtubeUrl: 'https://www.youtube.com',
  },
];
