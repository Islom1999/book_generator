import { TemplatePage } from './ajdaho.template';

export const OY_TUYA_SLUG = 'oy-tuya';

const WW =
  'WonderWraps medium shot, child LARGE in foreground (waist-up / 3/4). Full-bleed, no cream band, no headshot, not a distant figure.';

export const OY_TUYA_PAGES: TemplatePage[] = [
  {
    pageNumber: 1,
    file: 'page-01-cover.jpg',
    textUz: 'Sevimli {{name}}ga. Oy tuya seni cho‘lda kutadi.',
    textRu: 'Любимому {{name}}. Лунный верблюд ждёт тебя в степи.',
    scene: `${WW} COVER night desert: child LARGE beside a gentle cream-gold camel, huge silver moon, dunes and stars. Child holds a small lantern.`,
    hasChild: true,
  },
  {
    pageNumber: 2,
    file: 'page-02-dunes.jpg',
    textUz:
      '{{name}} tuya bilan oy yorug‘ida yurdi. Quvlar jim, yulduzlar yo‘l ko‘rsatdi.',
    textRu:
      '{{name}} шёл(шла) с верблюдом при луне. Дюны молчали, звёзды указывали путь.',
    scene: `${WW} Child LARGE walking with the same camel on moonlit dunes, distant caravan lanterns, starry navy sky.`,
    hasChild: true,
  },
  {
    pageNumber: 3,
    file: 'page-03-rest.jpg',
    textUz:
      '{{name}} tuyaga suyanib uxlab qoldi. Oy esa ularni mehr bilan qo‘riqladi. Oxiri.',
    textRu:
      '{{name}} уснул(а), прислонившись к верблюду. Луна бережно сторожила их. Конец.',
    scene: `${WW} Child LARGE sitting against the resting camel, looking up at a close glowing moon. Peaceful night ending.`,
    hasChild: true,
  },
];
