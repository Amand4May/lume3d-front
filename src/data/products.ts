import productPlaBlue from "@/assets/product-pla-blue.jpg";
import productPetgClear from "@/assets/product-petg-clear.jpg";
import productPlaRed from "@/assets/product-pla-red.jpg";
import productPlaWhite from "@/assets/product-pla-white.jpg";
import productPetgBlack from "@/assets/product-petg-black.jpg";
import productPlaGreen from "@/assets/product-pla-green.jpg";
import productPetgOrange from "@/assets/product-petg-orange.jpg";
import productHero3d from "@/assets/hero-3dprint.jpg";
import impresso3d from "@/assets/impresso3d.png";
import impresso3dazul from "@/assets/impresso3dazul.webp";

export interface Product {
  id: string;
  name: string;
  category: string;
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
    id: "model-keychain-robot",
    name: "Chaveiro Robô - Azul",
    category: "Modelos Prontos",
    price: 24.9,
    pixPrice: 22.9,
    image: productPlaBlue,
    images: [productPlaBlue],
    tag: "Promoção",
    description: "Chaveiro 3D pronto, estilo robô, impresso em PLA com acabamento liso. Ideal para lembrancinhas e brindes.",
    specs: { "Material": "PLA (impresso)", "Dimensões aproximadas": "40 x 25 x 5 mm", "Acabamento": "Liso / Pintura opcional" },
    reviews: [
      { author: "Carlos M.", rating: 5, text: "Ótimo acabamento, chegou como na foto." },
    ],
  },
  {
    id: "model-decor-transparent",
    name: "Peça Decorativa Transparente",
    category: "Modelos Prontos",
    price: 49.9,
    pixPrice: 44.9,
    image: productPetgClear,
    images: [productPetgClear],
    description: "Peça decorativa pronta, impressa em PETG transparente. Excelente para luminárias e display.",
    specs: { "Material": "PETG (impresso)", "Dimensões aproximadas": "60 x 60 x 20 mm", "Uso": "Decoração / Display" },
    reviews: [
      { author: "Roberto S.", rating: 5, text: "Transparência muito boa." },
    ],
  },
  {
    id: "model-mini-figure",
    name: "Miniatura Colecionável - Vermelho",
    category: "Modelos Prontos",
    price: 79.9,
    pixPrice: 72.9,
    image: productPlaRed,
    images: [productPlaRed],
    description: "Miniatura colecionável pronta, detalhes finos e acabamento profissional. Perfeita para colecionadores.",
    specs: { "Material": "PLA (impresso)", "Dimensões aproximadas": "80 x 45 x 40 mm", "Acabamento": "Detalhado" },
    reviews: [
      { author: "Maria L.", rating: 5, text: "Acabamento incrível, detalhado." },
    ],
  },
  {
    id: "model-display-white",
    name: "Peça de Exposição - Branco",
    category: "Modelos Prontos",
    price: 59.9,
    pixPrice: 54.9,
    image: productPlaWhite,
    images: [productPlaWhite],
    tag: "Promoção",
    description: "Peça pronta para exposição, acabamento opaco branco. Ideal para protótipos de apresentação.",
    specs: { "Material": "PLA (impresso)", "Dimensões aproximadas": "100 x 50 x 30 mm", "Uso": "Exposição / Protótipo" },
    reviews: [],
  },
  {
    id: "model-functional-black",
    name: "Peça Funcional - Preto",
    category: "Modelos Prontos",
    price: 69.9,
    pixPrice: 62.9,
    image: productPetgBlack,
    images: [productPetgBlack],
    description: "Peça funcional pronta, impressa em PETG para maior resistência ao impacto. Indicada para encaixes e protótipos funcionais.",
    specs: { "Material": "PETG (impresso)", "Dimensões aproximadas": "70 x 40 x 30 mm", "Resistência": "Alta" },
    reviews: [
      { author: "João V.", rating: 4, text: "Resistente e funcional." },
    ],
  },
  {
    id: "model-keychain-neon",
    name: "Chaveiro Neon - Verde",
    category: "Modelos Prontos",
    price: 29.9,
    pixPrice: 26.9,
    image: productPlaGreen,
    images: [productPlaGreen],
    description: "Chaveiro pronto em PLA verde neon, visual vibrante ideal para brindes e promoções.",
    specs: { "Material": "PLA (impresso)", "Dimensões aproximadas": "45 x 25 x 6 mm", "Acabamento": "Neon" },
    reviews: [],
  },
  {
    id: "model-figure-orange",
    name: "Boneco Modelo - Laranja",
    category: "Modelos Prontos",
    price: 129.9,
    pixPrice: 119.9,
    image: productPetgOrange,
    images: [productPetgOrange],
    tag: "Lançamento",
    description: "Boneco modelo pronto, maior escala e detalhes impressos em PETG para maior durabilidade.",
    specs: { "Material": "PETG (impresso)", "Dimensões aproximadas": "150 x 80 x 60 mm", "Uso": "Colecionável / Exibição" },
    reviews: [
      { author: "Pedro F.", rating: 5, text: "Detalhes ótimos e resistente." },
    ],
  },
  // Serviço de Impressão 3D Personalizada (anúncio único)
  {
    id: "impressao-3d-personalizada",
    name: "Impressão 3D Personalizada",
    category: "Impressao 3d",
    price: 0.0,
    pixPrice: 0.0,
    image: impresso3dazul,
    images: [impresso3d, impresso3dazul],
    tag: "Lançamento",
    description:
      "Serviço de impressão 3D personalizada. Envie o arquivo do modelo (STL/OBJ/ZIP) e escolha o tipo de filamento: PLA, ABS, PETG ou TPU. Há um campo de 'Observações' para informar acabamento, escala, tolerâncias ou solicitações especiais. O upload do arquivo é mantido. O preço final será confirmado após análise técnica do arquivo e das opções escolhidas.",
    specs: {
      "Filamentos disponíveis": "PLA, ABS, PETG, TPU",
      "Envio de arquivo": "STL/OBJ/ZIP",
      "Observações": "Campo de texto livre para requisitos adicionais",
      "Nota": "Preço final confirmado após análise técnica",
    },
    reviews: [
      { author: "Lorena M.", rating: 5, text: "Acabamento impecável e entrega rápida, recomendo!" },
      { author: "Larissa Gomes", rating: 5, text: "Muitcho bom, amei a qualidade do produto." },
      { author: "Ana Carolina", rating: 5, text: "Ótima comunicação e resultado conforme solicitado." },
      { author: "Amanda", rating: 4, text: "Peça ficou muito boa, só precisei de um pequeno ajuste com o suporte." },
    ],
  },
];
