export type KotobaItem = {
  id: string;
  text: string | null;
  showQuote: boolean;
  work: string;
  author: string;
  type: 'book' | 'song' | 'film' | 'manga' | 'other';
  memo?: string;
  externalUrl?: string;
  instagramUrl?: string;
};

export type ArukiItem = {
  id: string;
  title: string;
  image: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  mapUrl?: string;
  period: string;
  caption: string;
  instagramUrl?: string;
  sellable: boolean;
  productType?: 'postcard' | 'calendar' | 'print' | 'other';
  productUrl?: string;
};

export type AsobitItem = {
  id: string;
  title: string;
  description: string;
  status: 'idea' | 'wip' | 'published';
  tech: string[];
  screenshot?: string;
  appStoreUrl?: string;
  webUrl?: string;
  githubUrl?: string;
  externalUrl?: string;
  publishedAt?: string;
  memo?: string;
};

export type NoteItem = {
  id: string;
  title: string;
  description: string;
  theme: string;
  publishedAt: string;
  noteUrl: string;
  thumbnail?: string;
  type: 'essay' | 'story' | 'magazine' | 'memo' | 'other';
};

export type YohakuItem = {
  id: string;
  title: string;
  location: string;
  period: string;
  description: string;
  image?: string;
  externalUrl?: string;
  instagramUrl?: string;
  memo?: string;
};

export type NagiItem = {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnail?: string;
  location?: string;
  period?: string;
  coordinates?: { lat: number; lng: number };
  memo?: string;
};

export type CategoryId = 'kotoba' | 'aruki' | 'asobi' | 'note' | 'yohaku' | 'nagi';

export type CategoryMeta = {
  id: CategoryId;
  label: string;
  description: string;
  instagramLabel?: string;
  instagramButtonText?: string;
  instagramUrl?: string;
};
