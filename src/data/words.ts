// src/data/words.ts
// 「言葉」ページのデータ。
//
// ジャンル別に管理。text は縦書きで表示されるため、\n で改行位置を調整できる。
// 属性フィールドはすべて任意。ある場合のみジャンルに応じた形式で表示される。
// 後から自分でデータを追加する際は、各ジャンルの既存データをコピーして id と text を変えるだけでOK。

export type WordGenre = 'novel' | 'lyrics' | 'manga' | 'film' | 'person';

export const genreLabels: Record<WordGenre, string> = {
  novel:  '小説',
  lyrics: '歌詞',
  manga:  '漫画',
  film:   '映像',
  person: '人物',
};

export const GENRES: WordGenre[] = ['novel', 'lyrics', 'manga', 'film', 'person'];

export type WordItem = {
  id: string;
  genre: WordGenre;
  text: string;            // 言葉本文（縦書きで表示）
  title?: string;          // 作品名・曲名（小説→作品名、歌詞→曲名、漫画/映像→作品名）
  personName?: string;     // 人物名・キャラクター名（漫画/映像→セリフの人物、人物→その人）
  authorOrArtist?: string; // 著者・アーティスト名（歌詞向け）
  url?: string;            // 外部リンク（任意。将来的に作品ページへ飛ばす場合など）
};

// ── 表示用の属性文字列を生成（ジャンルに応じて組み立て） ──────────────────────
export function buildAttribution(word: WordItem): string | null {
  switch (word.genre) {
    case 'novel':
      return word.title ?? null;
    case 'lyrics':
      if (word.title && word.authorOrArtist) return `${word.title} / ${word.authorOrArtist}`;
      return word.title ?? word.authorOrArtist ?? null;
    case 'manga':
    case 'film':
      if (word.personName && word.title) return `${word.personName}（${word.title}）`;
      return word.personName ?? word.title ?? null;
    case 'person':
      return word.personName ?? null;
    default:
      return null;
  }
}

// ── ダミーデータ（後から実データに差し替えてください） ───────────────────────

export const words: WordItem[] = [

  // ── 小説 ─────────────────────────────────────────────────────────────────
  {
    id: 'n01',
    genre: 'novel',
    text: '風の音だけが\n聞こえる場所を\nずっと探している。',
    title: '仮・小説タイトル',
  },
  {
    id: 'n02',
    genre: 'novel',
    text: '時間は川のように\n流れているのではなく、\nもっと静かに、\n染みこんでいく。',
    title: '仮・小説タイトル',
  },
  {
    id: 'n03',
    genre: 'novel',
    text: '光は必ず、\n影を連れている。',
  },

  // ── 歌詞 ─────────────────────────────────────────────────────────────────
  {
    id: 'l01',
    genre: 'lyrics',
    text: 'どこへ行くのか\n知らないまま\n歩いていた。',
    title: '仮・曲名',
    authorOrArtist: '仮・アーティスト名',
  },
  {
    id: 'l02',
    genre: 'lyrics',
    text: '言葉より先に\n音楽が来た。',
    title: '仮・曲名',
    authorOrArtist: '仮・アーティスト名',
  },

  // ── 漫画 ─────────────────────────────────────────────────────────────────
  {
    id: 'm01',
    genre: 'manga',
    text: '泣くのは\n弱いからじゃない。\nずっと強くあろうと\nしてきたからだ。',
    personName: '仮・キャラクター名',
    title: '仮・漫画タイトル',
  },
  {
    id: 'm02',
    genre: 'manga',
    text: '諦めた瞬間に\n試合は終わる。',
    personName: '仮・キャラクター名',
    title: '仮・漫画タイトル',
  },

  // ── 映像 ─────────────────────────────────────────────────────────────────
  {
    id: 'f01',
    genre: 'film',
    text: '旅に出るのは\n遠くへ行くためではなく、\n自分の輪郭を\n確かめるためだ。',
    personName: '仮・人物名',
    title: '仮・作品タイトル',
  },
  {
    id: 'f02',
    genre: 'film',
    text: 'はじまりはいつも\n小さな違和感だった。',
    title: '仮・作品タイトル',
  },

  // ── 人物 ─────────────────────────────────────────────────────────────────
  {
    id: 'p01',
    genre: 'person',
    text: '余白があるから、\n言葉は息ができる。',
    personName: '仮・人物名',
  },
  {
    id: 'p02',
    genre: 'person',
    text: '美しいものを見続けることが、\n美しくあることだ。',
    personName: '仮・人物名',
  },

];
