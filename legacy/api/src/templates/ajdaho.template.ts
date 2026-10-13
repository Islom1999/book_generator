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
    file: 'page-05-share.jpg',
    textUz:
      '{{name}} nonini ajdaho bilan bo‘lishdi. Mehribonlik qo‘rquvni do‘stlikka aylantirdi.',
    textRu:
      '{{name}} поделился(ась) хлебом с драконом. Доброта превратила страх в дружбу.',
    scene: `${WW} Child sharing bread with the friendly purple-gold dragon in an apricot orchard.`,
    hasChild: true,
  },
  {
    pageNumber: 3,
    file: 'page-07-sleep.jpg',
    textUz:
      'Uyga qaytib, {{name}} tinch uxlab qoldi. Ajdaho esa qishloqni mehr bilan qo‘riqladi. Oxiri.',
    textRu:
      'Вернувшись домой, {{name}} спокойно заснул(а). Дракон бережно сторожил деревню. Конец.',
    scene: `${WW} Child sleeping in bed, window shows the dragon on a hill over a starry village.`,
    hasChild: true,
  },
];
