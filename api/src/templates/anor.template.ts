import { TemplatePage } from './ajdaho.template';

export const ANOR_SLUG = 'anor-yulduzi';

export const ANOR_PAGES: TemplatePage[] = [
  {
    pageNumber: 1,
    file: 'page-01-cover.jpg',
    textUz: 'Sevimli {{name}}ga. Anor bog‘ida yulduz seni kutadi.',
    textRu: 'Любимому {{name}}. В гранатовом саду тебя ждёт звезда.',
    scene:
      'WonderWraps-style COVER, medium shot waist-up: one child LARGE in the foreground with a lantern, small star-spirit beside them, pomegranate village behind. Keep this camera distance — not a headshot, not a tiny distant figure.',
    hasChild: true,
  },
  {
    pageNumber: 2,
    file: 'page-02-fruit.jpg',
    textUz:
      '{{name}} anorni ochdi. Ichida kichik yulduz charaqladi. Ko‘zlari hayratdan kengaydi.',
    textRu:
      '{{name}} раскрыл(а) гранат. Внутри вспыхнула маленькая звезда. Глаза расширились от чуда.',
    scene:
      'WonderWraps-style interior, medium shot 3/4 body: one child LARGE walking toward camera on a village path, holding a glowing pomegranate. Keep this framing.',
    hasChild: true,
  },
  {
    pageNumber: 3,
    file: 'page-03-stars.jpg',
    textUz:
      'Yulduz {{name}}ning ko‘zlarida qoldi. Endi har kecha osmon uni kutadi. Oxiri.',
    textRu:
      'Звезда осталась в глазах {{name}}. Теперь каждое небо ждёт его(её). Конец.',
    scene:
      'WonderWraps-style interior, waist-up on a tree branch: one child LARGE in the foreground reaching toward a glowing star. Village through leaves behind. Keep this camera distance.',
    hasChild: true,
  },
];
