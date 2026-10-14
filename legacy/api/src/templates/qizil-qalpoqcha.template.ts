import { TemplatePage } from './ajdaho.template';

export const QIZIL_QALPOQCHA_SLUG = 'qizil-qalpoqcha';

const WW =
  'WonderWraps medium shot, child LARGE in foreground (waist-up / 3/4). Full-bleed, no cream band, no headshot, not a distant figure.';

export const QIZIL_QALPOQCHA_PAGES: TemplatePage[] = [
  {
    pageNumber: 1,
    file: 'page-01-cover.jpg',
    textUz:
      'Bir bor ekan, bir yo‘q ekan, {{name}} degan bola yashar ekan. U doim qizil qalpoqcha kiyib yurgani uchun uni “Qizil Qalpoqchali Kichkintoy” deb chaqirishardi.',
    textRu:
      'Жил-был ребёнок по имени {{name}}. Он(а) всегда носил(а) красную шапочку, поэтому все звали его(её) «Крошка в красной шапочке».',
    scene: `${WW} Cover: child in a red hooded cape, carrying a wicker basket, walking down a sunlit forest path with flowers and tall trees.`,
    hasChild: true,
  },
  {
    pageNumber: 2,
    file: 'page-02-basket.jpg',
    textUz:
      'Bir kuni onasi {{name}}ga savatcha to‘la pirog va asal berib: “Buni buvingga olib bor, u kasal bo‘lib qolibdi”, dedi.',
    textRu:
      'Однажды мама дала {{name}} корзинку с пирогом и мёдом: «Отнеси это бабушке, она заболела», — сказала она.',
    scene: `${WW} Child in a red hooded cape in a cozy wooden kitchen, mother handing over a wicker basket with a pie and a honey jar.`,
    hasChild: true,
  },
  {
    pageNumber: 3,
    file: 'page-03-path.jpg',
    textUz:
      '{{name}} o‘rmon oralab yo‘lga tushdi. Yo‘l-yo‘lakay gullarni terib, qushlarning sayrashini tinglab bordi.',
    textRu:
      '{{name}} отправился(ась) через лес. По пути собирал(а) цветы и слушал(а) пение птиц.',
    scene: `${WW} Child in a red hooded cape walking a forest path holding a basket, reaching for a flower, butterflies and birds nearby.`,
    hasChild: true,
  },
  {
    pageNumber: 4,
    file: 'page-04-wolf.jpg',
    textUz:
      'To‘satdan yo‘lida ayyor bir bo‘ri paydo bo‘ldi. “Qayoqqa ketyapsan, kichkintoy?” deb so‘radi bo‘ri mehribon ovozda.',
    textRu:
      'Вдруг на пути появился хитрый волк. «Куда ты идёшь, малыш?» — спросил волк ласковым голосом.',
    scene: `${WW} Child in a red hooded cape on a forest path facing a large friendly-looking grey wolf in a leather vest, cottage visible behind trees.`,
    hasChild: true,
  },
  {
    pageNumber: 5,
    file: 'page-05-run.jpg',
    textUz:
      '“Buvimning uyiga”, dedi u beg‘ubor. Ayyor bo‘ri darrov qisqa yo‘ldan yugurib, buvidan oldinroq yetib oldi.',
    textRu:
      '«К бабушке», — простодушно ответил(а) {{name}}. Хитрый волк тут же побежал коротким путём и добрался до бабушки первым.',
    scene: `${WW} Child in a red hooded cape walking calmly on the path while, further away, a large grey wolf runs ahead through the forest toward a cottage.`,
    hasChild: true,
  },
  {
    pageNumber: 6,
    file: 'page-06-disguise.jpg',
    textUz:
      'Bo‘ri buvining uyiga birinchi bo‘lib yetib bordi va uni yashirib qo‘yib, o‘zi uning o‘rniga yotib oldi.',
    textRu:
      'Волк первым добрался до бабушкиного дома, спрятал её и сам улёгся в её постель вместо неё.',
    scene: `${WW} Cozy cottage bedroom, a large grey wolf wearing a nightcap and shawl lying in a patchwork-quilt bed, child in a red hooded cape peeking in from the doorway.`,
    hasChild: true,
  },
  {
    pageNumber: 7,
    file: 'page-07-knock.jpg',
    textUz:
      '{{name}} yetib kelib, eshikni taqillatdi. Ichkariga kirib, buvisi bilan salomlashish uchun shoshildi.',
    textRu:
      '{{name}} подошёл(шла) к дому и постучал(а) в дверь. Поспешил(а) войти, чтобы поздороваться с бабушкой.',
    scene: `${WW} Child in a red hooded cape knocking on the wooden door of a stone cottage, wicker basket in hand, lantern glowing beside the door.`,
    hasChild: true,
  },
  {
    pageNumber: 8,
    file: 'page-08-eyes.jpg',
    textUz:
      '“Nega ko‘zlaring bunchalik katta, buvijon?” deb hayron bo‘ldi u. “Seni yaxshiroq ko‘rish uchun!” dedi bo‘ri va sakrab o‘rnidan turdi.',
    textRu:
      '«Почему у тебя такие большие глаза, бабушка?» — удивился(ась) {{name}}. «Чтобы лучше тебя видеть!» — сказал волк и вскочил с кровати.',
    scene: `${WW} Cottage bedroom, child in a red hooded cape standing beside the bed looking startled at a large grey wolf in a nightcap and glasses sitting up in bed.`,
    hasChild: true,
  },
  {
    pageNumber: 9,
    file: 'page-09-woodsman.jpg',
    textUz:
      'Aynan shu payt yaqin atrofda yurgan o‘rmonchi qichqiriqni eshitib yugurib keldi va bo‘rini quvib chiqardi.',
    textRu:
      'В этот момент проходивший рядом дровосек услышал крик, прибежал и прогнал волка.',
    scene: `${WW} Cottage bedroom doorway, a woodsman with an axe rushing in, child in a red hooded cape beside him, a large grey wolf leaping off the bed startled.`,
    hasChild: true,
  },
  {
    pageNumber: 10,
    file: 'page-10-happy.jpg',
    textUz:
      'Buvi shkafdan sog‘-omon topildi. Uchovlon birga o‘tirib, pirog yeb, xursand bo‘lishdi. {{name}} begonalar bilan gaplashmaslikni yaxshi angladi. Oxiri.',
    textRu:
      'Бабушку нашли целой и невредимой в шкафу. Все трое сели вместе, ели пирог и радовались. {{name}} хорошо усвоил(а), что нельзя разговаривать с незнакомцами. Конец.',
    scene: `${WW} Cozy cottage kitchen, child in a red hooded cape sitting at a wooden table with a smiling grandmother, sharing a pie, tea and flowers, warm sunlight.`,
    hasChild: true,
  },
];
