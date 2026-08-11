export interface Book {
  id: string;
  slug: string;
  titleUz: string;
  titleRu: string;
  descUz: string;
  descRu: string;
  price: number;
  ageRange: string;
  pageCount: number;
  freePages: number;
  badge: string | null;
  gender: string | null;
  hue: number;
  emoji: string;
  coverUrl: string | null;
}

export interface StoryPage {
  pageNumber: number;
  text: string;
  imagePrompt: string;
  imageUrl: string | null;
  locked: boolean;
}

export interface Personalization {
  id: string;
  book: Book;
  childName: string;
  childAge: number;
  gender: string;
  bookLang: string;
  dedication: string | null;
  photoUrl: string;
  generatedTitle: string | null;
  status: string;
  errorMessage: string | null;
  pages: StoryPage[];
}

export interface CartItem {
  key: string;
  personalization: Personalization;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  paymentMethod: string;
  status: string;
  total: number;
  items: {
    id: string;
    price: number;
    book: Book;
    personalization: Personalization | null;
  }[];
  createdAt: string;
}
