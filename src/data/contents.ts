// src/data/contents.ts

export type ContentCategory = 'note' | 'app' | 'link' | 'photo' | 'video' | 'activity';

export type ContentItem = {
  id: string;
  title: string;
  category: ContentCategory;
  description: string;
  image: string;
  url: string;
  isExternal: boolean;
  tags?: string[];
  accentColor: string;
};

export const categoryLabels: Record<ContentCategory, string> = {
  note: 'note記事',
  app: 'アプリ',
  link: 'リンク',
  photo: '写真',
  video: '動画',
  activity: '活動',
};

/*
  ── カテゴリカラー（Air Palette）────────────────────────
  すべて彩度を抑えた自然由来の中間色。
  白背景でも浮きすぎず、消えすぎない濃さに統一。
  ────────────────────────────────────────────────────────
  note     : 枯れ葦・砂漠の草       温かみある砂灰
  app      : 曇り空・遠い水面       冷静な青灰
  link     : 苔・林の奥             穏やかな緑灰
  photo    : 夕暮れの雲・霞         くすんだローズグレー
  video    : 浅瀬・霧の海峡         静かな青緑灰
  activity : 山影・森の稜線         落ち着いた青みがかった灰緑
*/
export const categoryColors: Record<ContentCategory, string> = {
  note:     '#8c8270',  // 砂灰
  app:      '#6a7e96',  // 青灰
  link:     '#6a8a78',  // 緑灰
  photo:    '#8a7882',  // ローズグレー
  video:    '#5e8090',  // 青緑灰
  activity: '#6e7e72',  // 青みがかった灰緑
};

export const contents: ContentItem[] = [
  {
    id: 'page-words',
    title: '言葉',
    category: 'note',
    description: '集めてきた言葉たち。自分の言葉と、出会った言葉と。',
    image: '',
    url: '/words',
    isExternal: false,
    tags: ['言葉'],
    accentColor: '#8c8270',
  },
  {
    id: 'c01',
    title: '旅と記憶について',
    category: 'note',
    description: '旅先で出会った風景が、時間を経てどんなふうに記憶に変わっていくのかを書きました。',
    image: '/images/contents/note-01.jpg',
    url: 'https://note.com',
    isExternal: true,
    tags: ['旅', '記憶', 'エッセイ'],
    accentColor: '#9e8e7a',
  },
  {
    id: 'c02',
    title: '光の集め方',
    category: 'photo',
    description: '朝と夕方、光が地面に落ちる瞬間だけを集めた写真のシリーズ。',
    image: '/images/contents/photo-01.jpg',
    url: '/gallery/light',
    isExternal: false,
    tags: ['光', '朝', '夕方'],
    accentColor: '#b09070',
  },
  {
    id: 'c03',
    title: 'Memoria App',
    category: 'app',
    description: '日々の小さな出来事を、地図と写真で記録できるiOSアプリ。',
    image: '/images/contents/app-01.jpg',
    url: 'https://apps.apple.com',
    isExternal: true,
    tags: ['iOS', '記録', 'マップ'],
    accentColor: '#6a7e96',
  },
  {
    id: 'c04',
    title: '海辺の朝',
    category: 'video',
    description: '夜明けの海。波の音と光の変化だけを、15分間記録した映像。',
    image: '/images/contents/video-01.jpg',
    url: 'https://youtube.com',
    isExternal: true,
    tags: ['海', '朝', '映像'],
    accentColor: '#5e8090',
  },
  {
    id: 'c05',
    title: 'たてもの探訪',
    category: 'activity',
    description: '気になる建物を訪ね歩く活動。古い商店から現代建築まで、空間の記録。',
    image: '/images/contents/activity-01.jpg',
    url: '/activities/buildings',
    isExternal: false,
    tags: ['建築', '散歩', '記録'],
    accentColor: '#7e8a7a',
  },
  {
    id: 'c06',
    title: '静かな場所のあつめ方',
    category: 'note',
    description: '都市の中に残る静かな場所を探し続けて気づいたこと。',
    image: '/images/contents/note-02.jpg',
    url: 'https://note.com',
    isExternal: true,
    tags: ['都市', '静寂', 'エッセイ'],
    accentColor: '#8c8270',
  },
  {
    id: 'c07',
    title: '植物のある暮らし',
    category: 'photo',
    description: '窓辺の植物たちと日常の光の記録。四季ごとの変化を捉えた写真。',
    image: '/images/contents/photo-02.jpg',
    url: '/gallery/plants',
    isExternal: false,
    tags: ['植物', '暮らし', '光'],
    accentColor: '#7a9080',
  },
  {
    id: 'c08',
    title: 'zine「余白」',
    category: 'link',
    description: '写真と言葉で構成した手製本。余白についての小さなエッセイ集。',
    image: '/images/contents/link-01.jpg',
    url: 'https://minne.com',
    isExternal: true,
    tags: ['zine', '余白', '手製本'],
    accentColor: '#9a8e7a',
  },
  {
    id: 'c09',
    title: '山の稜線',
    category: 'video',
    description: '夜明け前から夜明け後まで、稜線の空の色が変わる様子をタイムラプスで。',
    image: '/images/contents/video-02.jpg',
    url: 'https://youtube.com',
    isExternal: true,
    tags: ['山', '空', 'タイムラプス'],
    accentColor: '#7080a0',
  },
  {
    id: 'c10',
    title: '読書の記録 2024',
    category: 'note',
    description: '2024年に読んだ本の中で、特に心に残った10冊についてのノート。',
    image: '/images/contents/note-03.jpg',
    url: 'https://note.com',
    isExternal: true,
    tags: ['読書', '本', '記録'],
    accentColor: '#907a7a',
  },
  {
    id: 'c11',
    title: 'Palette Tool',
    category: 'app',
    description: '写真から色を抽出して、自分だけのカラーパレットを作るウェブツール。',
    image: '/images/contents/app-02.jpg',
    url: 'https://palette.example.com',
    isExternal: true,
    tags: ['色', 'ツール', 'デザイン'],
    accentColor: '#7a7a94',
  },
  {
    id: 'c12',
    title: '雨の日の散歩',
    category: 'photo',
    description: '雨の日にしか撮れない光と色がある。濡れた街の断片集。',
    image: '/images/contents/photo-03.jpg',
    url: '/gallery/rain',
    isExternal: false,
    tags: ['雨', '街', '光'],
    accentColor: '#6a8898',
  },
  {
    id: 'c13',
    title: 'ものつくり訪問',
    category: 'activity',
    description: '各地の工房や職人を訪ねる活動。作る過程に宿る時間の記録。',
    image: '/images/contents/activity-02.jpg',
    url: '/activities/crafts',
    isExternal: false,
    tags: ['工芸', '職人', '旅'],
    accentColor: '#9a7e6a',
  },
  {
    id: 'c14',
    title: '言葉と空白',
    category: 'note',
    description: '言葉が生まれる前の、空白の時間について考えたエッセイ。',
    image: '/images/contents/note-04.jpg',
    url: 'https://note.com',
    isExternal: true,
    tags: ['言葉', '空白', '思考'],
    accentColor: '#7a9084',
  },
  {
    id: 'c15',
    title: '港の夕景',
    category: 'video',
    description: '小さな港に沈む夕日。船の影と光の揺れ、15分間の静かな記録。',
    image: '/images/contents/video-03.jpg',
    url: 'https://vimeo.com',
    isExternal: true,
    tags: ['港', '夕日', '映像'],
    accentColor: '#a07a60',
  },
  {
    id: 'c16',
    title: 'ポストカードショップ',
    category: 'link',
    description: '旅先の風景を撮影した写真をポストカードにして販売しています。',
    image: '/images/contents/link-02.jpg',
    url: '/postcard',
    isExternal: false,
    tags: ['ポストカード', '写真', '販売'],
    accentColor: '#8a9470',
  },
  {
    id: 'c17',
    title: '霧の朝の森',
    category: 'photo',
    description: '早朝の森に立ち込める霧。光が差し込む瞬間を待ち続けた写真。',
    image: '/images/contents/photo-04.jpg',
    url: '/gallery/forest',
    isExternal: false,
    tags: ['森', '霧', '朝'],
    accentColor: '#6a8878',
  },
  {
    id: 'c18',
    title: '音の地図をつくる',
    category: 'activity',
    description: '街の中の音を採集して地図に落とし込む試み。騒音と静寂の分布図。',
    image: '/images/contents/activity-03.jpg',
    url: '/activities/sound-map',
    isExternal: false,
    tags: ['音', '地図', '都市'],
    accentColor: '#707a8e',
  },
  {
    id: 'c19',
    title: '旅の手帖 vol.3',
    category: 'link',
    description: '各地の記録を集めた小冊子の第三号。手書きのメモと写真で構成。',
    image: '/images/contents/link-03.jpg',
    url: 'https://booth.pm',
    isExternal: true,
    tags: ['旅', '手帖', '冊子'],
    accentColor: '#9a8e7e',
  },
  {
    id: 'c20',
    title: '夜の駅舎',
    category: 'photo',
    description: '人けのなくなった深夜の駅。光と影が作り出す静謐な空間の記録。',
    image: '/images/contents/photo-05.jpg',
    url: '/gallery/station',
    isExternal: false,
    tags: ['駅', '夜', '光'],
    accentColor: '#606878',
  },
];
