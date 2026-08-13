export interface TemplatePage {
  pageNumber: number;
  file: string;
  textUz: string;
  textRu: string;
  scene: string;
  hasChild: boolean;
}

export const AJDAHO_SLUG = 'amir-va-ajdaho';

const WW =
  'WonderWraps medium shot, child LARGE in foreground (waist-up / 3/4). Full-bleed, no cream band, no headshot, not a distant figure.';

export const AJDAHO_PAGES: TemplatePage[] = [
  {
    pageNumber: 1,
    file: 'page-01-cover.jpg',
    textUz: 'Sevimli {{name}}ga. {{age}} yoshing muborak!',
    textRu: 'Любимому {{name}}. С {{age}}-летием!',
    scene: `${WW} Cover: child hugging a friendly purple-gold dragon, apricot tree and village behind.`,
    hasChild: true,
  },
  {
    pageNumber: 2,
    file: 'page-02-window.jpg',
    textUz:
      '{{name}} ertalab derazani ochdi. Quyosh kulib turardi. Bugun yangi sarguzasht uni kutardi.',
    textRu:
      '{{name}} утром открыл(а) окно. Солнце улыбалось. Сегодня ждало новое приключение.',
    scene: `${WW} Child opening a wooden window, swallows, pink blossoms, morning sun.`,
    hasChild: true,
  },
  {
    pageNumber: 3,
    file: 'page-03-path.jpg',
    textUz: 'U nonini olib tog‘ yo‘liga chiqdi. Gullar salom berdi. Yuragi dadil edi.',
    textRu: 'Он(а) взял(а) хлеб и пошёл(шла) в горы. Цветы здоровались. Сердце было смелым.',
    scene: `${WW} Exactly ONE child on a mountain path with bread and flowers, yurts behind.`,
    hasChild: true,
  },
  {
    pageNumber: 4,
    file: 'page-04-dragon.jpg',
    textUz:
      'Qoyalarda yolg‘iz ajdaho o‘tirardi. U qo‘rqinchli emasdi — shunchaki do‘st izlar edi.',
    textRu:
      'За скалами сидел одинокий дракон. Он был не страшный — просто искал друга.',
    scene:
      'Full-bleed: shy cute purple-gold dragon peeking from rocks, sunset mountains. No child.',
    hasChild: false,
  },
  {
    pageNumber: 5,
    file: 'page-05-share.jpg',
    textUz:
      '{{name}} nonini ajdaho bilan bo‘lishdi. Mehribonlik qo‘rquvni do‘stlikka aylantirdi.',
    textRu:
      '{{name}} поделился(ась) хлебом с драконом. Доброта превратила страх в дружбу.',
    scene: `${WW} Child sharing bread with the friendly purple-gold dragon in an apricot orchard.`,
    hasChild: true,
  },
  {
    pageNumber: 6,
    file: 'page-06-fly.jpg',
    textUz:
      'Yangi do‘st {{name}}ni osmon bo‘ylab uchirdi. Qishloq pastda oltindek porlardi.',
    textRu:
      'Новый друг прокатил {{name}} по небу. Внизу деревня сияла золотом.',
    scene: `${WW} Child riding the purple-gold dragon over a Central Asian city at sunset.`,
    hasChild: true,
  },
  {
    pageNumber: 7,
    file: 'page-07-sleep.jpg',
    textUz:
      'Uyga qaytib, {{name}} tinch uxlab qoldi. Ajdaho esa qishloqni mehr bilan qo‘riqladi. Oxiri.',
    textRu:
      'Вернувшись домой, {{name}} спокойно заснул(а). Дракон бережно сторожил деревню. Конец.',
    scene: `${WW} Child sleeping in bed, window shows the dragon on a hill over a starry village.`,
    hasChild: true,
  },
];
