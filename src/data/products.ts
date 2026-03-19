import productPlaBlue from "@/assets/product-pla-blue.jpg";
import productPetgClear from "@/assets/product-petg-clear.jpg";
import productPlaRed from "@/assets/product-pla-red.jpg";
import productPlaWhite from "@/assets/product-pla-white.jpg";
import productPetgBlack from "@/assets/product-petg-black.jpg";
import productPlaGreen from "@/assets/product-pla-green.jpg";
import productPetgOrange from "@/assets/product-petg-orange.jpg";

export interface Product {
  id: string;
  name: string;
  category: "PLA" | "PETG";
  price: number;
  pixPrice: number;
  image: string;
  images: string[];
  tag?: string;
  description: string;
  specs: Record<string, string>;
  reviews: { author: string; rating: number; text: string }[];
}

export const products: Product[] = [
  {
    id: "pla-blue",
    name: "Filamento PLA Azul 1.75mm 1kg",
    category: "PLA",
    price: 89.90,
    pixPrice: 79.90,
    image: productPlaBlue,
    images: [productPlaBlue],
    tag: "Promoção",
    description: "Filamento PLA de alta qualidade na cor azul. Ideal para prototipagem rápida e peças decorativas. Excelente acabamento superficial e fácil impressão.",
    specs: { "Diâmetro": "1.75mm", "Peso": "1kg", "Temperatura de Extrusão": "190-220°C", "Temperatura da Mesa": "50-60°C", "Tolerância": "±0.02mm" },
    reviews: [
      { author: "Carlos M.", rating: 5, text: "Excelente qualidade, cor vibrante e ótima aderência." },
      { author: "Ana P.", rating: 4, text: "Bom filamento, poucos entupimentos." },
    ],
  },
  {
    id: "petg-clear",
    name: "Filamento PETG Transparente 1.75mm 1kg",
    category: "PETG",
    price: 109.90,
    pixPrice: 97.90,
    image: productPetgClear,
    images: [productPetgClear],
    description: "Filamento PETG transparente com alta resistência mecânica e química. Perfeito para peças funcionais e aplicações industriais.",
    specs: { "Diâmetro": "1.75mm", "Peso": "1kg", "Temperatura de Extrusão": "230-250°C", "Temperatura da Mesa": "70-80°C", "Tolerância": "±0.02mm" },
    reviews: [
      { author: "Roberto S.", rating: 5, text: "Transparência incrível, muito resistente." },
    ],
  },
  {
    id: "pla-red",
    name: "Filamento PLA Vermelho 1.75mm 1kg",
    category: "PLA",
    price: 89.90,
    pixPrice: 79.90,
    image: productPlaRed,
    images: [productPlaRed],
    description: "Filamento PLA vermelho vibrante. Ótimo para modelos decorativos e protótipos com acabamento profissional.",
    specs: { "Diâmetro": "1.75mm", "Peso": "1kg", "Temperatura de Extrusão": "190-220°C", "Temperatura da Mesa": "50-60°C", "Tolerância": "±0.02mm" },
    reviews: [
      { author: "Maria L.", rating: 5, text: "Cor linda e consistência perfeita." },
    ],
  },
  {
    id: "pla-white",
    name: "Filamento PLA Branco 1.75mm 1kg",
    category: "PLA",
    price: 84.90,
    pixPrice: 74.90,
    image: productPlaWhite,
    images: [productPlaWhite],
    tag: "Promoção",
    description: "Filamento PLA branco com acabamento opaco. Ideal para pintura posterior e peças de apresentação.",
    specs: { "Diâmetro": "1.75mm", "Peso": "1kg", "Temperatura de Extrusão": "190-220°C", "Temperatura da Mesa": "50-60°C", "Tolerância": "±0.02mm" },
    reviews: [],
  },
  {
    id: "petg-black",
    name: "Filamento PETG Preto 1.75mm 1kg",
    category: "PETG",
    price: 109.90,
    pixPrice: 97.90,
    image: productPetgBlack,
    images: [productPetgBlack],
    description: "Filamento PETG preto com excelente resistência ao impacto. Ideal para peças mecânicas e funcionais.",
    specs: { "Diâmetro": "1.75mm", "Peso": "1kg", "Temperatura de Extrusão": "230-250°C", "Temperatura da Mesa": "70-80°C", "Tolerância": "±0.02mm" },
    reviews: [
      { author: "João V.", rating: 4, text: "Muito bom para peças funcionais, resistente." },
    ],
  },
  {
    id: "pla-green",
    name: "Filamento PLA Verde 1.75mm 1kg",
    category: "PLA",
    price: 89.90,
    pixPrice: 79.90,
    image: productPlaGreen,
    images: [productPlaGreen],
    description: "Filamento PLA verde fluorescente. Cor vibrante e excelente para peças visuais e protótipos artísticos.",
    specs: { "Diâmetro": "1.75mm", "Peso": "1kg", "Temperatura de Extrusão": "190-220°C", "Temperatura da Mesa": "50-60°C", "Tolerância": "±0.02mm" },
    reviews: [],
  },
  {
    id: "petg-orange",
    name: "Filamento PETG Laranja 1.75mm 1kg",
    category: "PETG",
    price: 114.90,
    pixPrice: 102.90,
    image: productPetgOrange,
    images: [productPetgOrange],
    tag: "Lançamento",
    description: "Filamento PETG laranja com alta durabilidade. Excelente para peças que requerem resistência térmica e mecânica.",
    specs: { "Diâmetro": "1.75mm", "Peso": "1kg", "Temperatura de Extrusão": "230-250°C", "Temperatura da Mesa": "70-80°C", "Tolerância": "±0.02mm" },
    reviews: [
      { author: "Pedro F.", rating: 5, text: "Qualidade excepcional, cor vibrante." },
    ],
  },
];
