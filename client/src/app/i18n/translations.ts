export type Translations = Record<string, string>;

export const LANGS = ['uz', 'ru', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'uz';

export const TRANSLATIONS: Record<Lang, Translations> = {
  uz: {
    'nav.brand': 'Ertaklar.uz',
    'hero.title': 'Farzandingiz — ertakning bosh qahramoni',
    'hero.subtitle':
      "Bolangizning ismi va surati bilan yaratilgan shaxsiy ertak kitobi. Bosma shaklda pochta bo'limiga yetkazib beramiz.",
    'hero.cta': 'Boshlash',
    'hero.soon': 'Tez orada ishga tushadi',
    'steps.title': 'Qanday ishlaydi',
    'steps.1.title': 'Ertakni tanlang',
    'steps.1.text': "Tayyor ertaklar orasidan farzandingizga yoqqanini tanlang.",
    'steps.2.title': 'Surat va ismni kiriting',
    'steps.2.text': "Bolangizning suratini yuklang, ismini va yoshini yozing.",
    'steps.3.title': 'Tasdiqlang va oling',
    'steps.3.text':
      "Moderator sahifalarni tekshiradi, bosma kitob esa pochta bo'limiga yuboriladi.",
    'footer.rights': 'Ertaklar.uz. Barcha huquqlar himoyalangan.',
  },
  ru: {
    'nav.brand': 'Ertaklar.uz',
    'hero.title': 'Ваш ребёнок — главный герой сказки',
    'hero.subtitle':
      'Персональная книга сказок с именем и фото вашего ребёнка. Доставим печатную книгу в почтовое отделение.',
    'hero.cta': 'Начать',
    'hero.soon': 'Скоро открытие',
    'steps.title': 'Как это работает',
    'steps.1.title': 'Выберите сказку',
    'steps.1.text': 'Выберите среди готовых сказок ту, что понравится вашему ребёнку.',
    'steps.2.title': 'Загрузите фото и имя',
    'steps.2.text': 'Загрузите фото ребёнка, укажите его имя и возраст.',
    'steps.3.title': 'Подтвердите и получите',
    'steps.3.text':
      'Модератор проверит страницы, а печатная книга будет отправлена в почтовое отделение.',
    'footer.rights': 'Ertaklar.uz. Все права защищены.',
  },
  en: {
    'nav.brand': 'Ertaklar.uz',
    'hero.title': 'Your child is the hero of the story',
    'hero.subtitle':
      "A personalised storybook with your child's name and photo. We deliver the printed book to your post office.",
    'hero.cta': 'Get started',
    'hero.soon': 'Launching soon',
    'steps.title': 'How it works',
    'steps.1.title': 'Pick a story',
    'steps.1.text': 'Choose the tale your child will love from our ready-made stories.',
    'steps.2.title': 'Add a photo and name',
    'steps.2.text': "Upload your child's photo and enter their name and age.",
    'steps.3.title': 'Approve and receive',
    'steps.3.text':
      'A moderator checks every page, then the printed book is sent to your post office.',
    'footer.rights': 'Ertaklar.uz. All rights reserved.',
  },
};
