export interface TemplatePage {
  pageNumber: number;
  file: string;
  textUz: string;
  textRu: string;
  scene: string;
  hasChild: boolean;
}

export const AJDAHO_SLUG = 'amir-va-ajdaho';

export const AJDAHO_PAGES: TemplatePage[] = [
  {
    pageNumber: 1,
    file: 'page-01-cover.jpg',
    textUz: 'Sevimli {{name}}ga. {{age}} yoshing muborak!',
    textRu: 'Любимому {{name}}. С {{age}}-летием!',
    scene:
      'Cover: child hugging a friendly round purple-gold dragon on a hillside at sunset, apricot tree, village and mountains. Empty cream band at the bottom 28% for text.',
    hasChild: true,
  },
  {
    pageNumber: 2,
    file: 'page-02-window.jpg',
    textUz:
      '{{name}} ertalab derazani ochdi. Quyosh kulib turardi. Bugun yangi sarguzasht uni kutardi.',
    textRu:
      '{{name}} утром открыл(а) окно. Солнце улыбалось. Сегодня ждало новое приключение.',
    scene:
      'Child in red vest opening a wooden window in a clay village house, swallows, pink blossoms, mountains, morning sun. Empty cream band at bottom 28%.',
    hasChild: true,
  },
  {
    pageNumber: 3,
    file: 'page-03-path.jpg',
    textUz: 'U nonini olib tog‘ yo‘liga chiqdi. Gullar salom berdi. Yuragi dadil edi.',
    textRu: 'Он(а) взял(а) хлеб и пошёл(шла) в горы. Цветы здоровались. Сердце было смелым.',
    scene:
      'EXACTLY ONE child walking the mountain path carrying bread and flowers. Do not add a second child. Yurts and snow mountains behind. Empty cream band at bottom 28%.',
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
      'A shy cute round purple-gold dragon peeking from behind rocks, pastel sunset mountains. Empty cream band at bottom 28%. Keep the dragon, no child required.',
    hasChild: false,
  },
  {
    pageNumber: 5,
    file: 'page-05-share.jpg',
    textUz:
      '{{name}} nonini ajdaho bilan bo‘lishdi. Mehribonlik qo‘rquvni do‘stlikka aylantirdi.',
    textRu:
      '{{name}} поделился(ась) хлебом с драконом. Доброта превратила страх в дружбу.',
    scene:
      'Child sharing bread with the friendly purple-gold dragon in an apricot orchard. Empty cream band at bottom 28%.',
    hasChild: true,
  },
  {
    pageNumber: 6,
    file: 'page-06-fly.jpg',
    textUz:
      'Yangi do‘st {{name}}ni osmon bo‘ylab uchirdi. Qishloq pastda oltindek porlardi.',
    textRu:
      'Новый друг прокатил {{name}} по небу. Внизу деревня сияла золотом.',
    scene:
      'Child riding the friendly purple-gold dragon over a Central Asian city at golden sunset. Empty cream band at bottom 28%.',
    hasChild: true,
  },
  {
    pageNumber: 7,
    file: 'page-07-sleep.jpg',
    textUz:
      'Uyga qaytib, {{name}} tinch uxlab qoldi. Ajdaho esa qishloqni mehr bilan qo‘riqladi. Oxiri.',
    textRu:
      'Вернувшись домой, {{name}} спокойно заснул(а). Дракон бережно сторожил деревню. Конец.',
    scene:
      'Child sleeping in a cozy bedroom, window shows the dragon curled on a hill over a starry village. Empty cream band at bottom 28%.',
    hasChild: true,
  },
];
