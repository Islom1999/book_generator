import { TemplatePage } from './ajdaho.template';

export const BAHOR_SLUG = 'bahor-kapalagi';

const WW =
  'WonderWraps medium shot, child LARGE in foreground (waist-up / 3/4). Full-bleed, no cream band, no headshot, not a distant figure.';

export const BAHOR_PAGES: TemplatePage[] = [
  {
    pageNumber: 1,
    file: 'page-01-cover.jpg',
    textUz: 'Sevimli {{name}}ga. Bahor kapalagi bog‘da seni kutadi.',
    textRu: 'Любимому {{name}}. Весенняя бабочка ждёт тебя в саду.',
    scene: `${WW} COVER spring orchard: child LARGE, a big friendly turquoise-gold butterfly near the shoulder, pink apricot blossoms, bright morning light.`,
    hasChild: true,
  },
  {
    pageNumber: 2,
    file: 'page-02-petals.jpg',
    textUz:
      '{{name}} kapalakni gullar orasida ko‘rdi. Yupqa qanotlar quyoshda porladi.',
    textRu:
      '{{name}} увидел(а) бабочку среди цветов. Тонкие крылья сверкали на солнце.',
    scene: `${WW} Child LARGE reaching toward the same butterfly among falling pink petals on a garden path, daylight, 3/4 body.`,
    hasChild: true,
  },
  {
    pageNumber: 3,
    file: 'page-03-hand.jpg',
    textUz:
      'Kapalak {{name}}ning kaftiga qo‘ndi. Bahor endi uning ko‘zlarida qoldi. Oxiri.',
    textRu:
      'Бабочка села на ладонь {{name}}. Весна осталась в его(её) глазах. Конец.',
    scene: `${WW} Child LARGE sitting in flowers, butterfly resting on an open hand, soft sunset orchard. Peaceful ending.`,
    hasChild: true,
  },
];
