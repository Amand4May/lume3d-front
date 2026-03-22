import productPlaBlue from "@/assets/product-pla-blue.jpg";
import productPetgClear from "@/assets/product-petg-clear.jpg";
import productPlaRed from "@/assets/product-pla-red.jpg";
import productPlaWhite from "@/assets/product-pla-white.jpg";
import productPetgBlack from "@/assets/product-petg-black.jpg";
import productPlaGreen from "@/assets/product-pla-green.jpg";
import productPetgOrange from "@/assets/product-petg-orange.jpg";
import suportetablet from "@/assets/suportetablet.jpeg";
import bonecokratos from "@/assets/bonecokratos.jpeg";
import bonecospiderman from "@/assets/bonecospiderman.jpeg";
import vaso from "@/assets/vaso.jpeg";
import portapaleta from "@/assets/portapaleta.jpeg";
import suporteheadset from "@/assets/suporteheadset.jpeg";
import portacaneta from "@/assets/portacaneta.jpeg";
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
    id: "tablet-suporte-black",
    name: "Suporte para Tablet - Preto",
    category: "Modelos Prontos",
    price: 24.9,
    pixPrice: 22.9,
    image: suportetablet,
    images: [suportetablet, productHero3d],
    tag: "Promoção",
    description: "Suporte para tablet pronto, estilo moderno, impresso em PLA com acabamento liso. Ideal para uso diário e suporte de dispositivos.",
    specs: { "Material": "PLA (impresso)", "Dimensões aproximadas": "40 x 25 x 5 mm", "Acabamento": "Liso / Pintura opcional" },
    reviews: [
      { author: "Carlos M.", rating: 5, text: "Ótimo acabamento, chegou como na foto." },
    ],
  },
  {
    id: "model-figure-kratos",
    name: "Boneco Kratos - Cinza",
    category: "Modelos Prontos",
    price: 119.9,
    pixPrice: 110.9,
    image: bonecokratos,
    images: [bonecokratos, productHero3d],
    description: "Modelo boneco kratos pronto, detalhes finos e acabamento profissional. Ideal para colecionadores.",
    specs: { "Material": "PETG (impresso)", "Dimensões aproximadas": "60 x 60 x 20 mm", "Uso": "Decoração / Display" },
    reviews: [
      { author: "Roberto S.", rating: 5, text: "Transparência muito boa." },
    ],
  },
  {
    id: "model-figure-spiderman",
    name: "Boneco Homem-Aranha - Cinza",
    category: "Modelos Prontos",
    price: 109.9,
    pixPrice: 92.9,
    image: bonecospiderman,
    images: [bonecospiderman, productHero3d],
    description: "Miniatura Homem-Aranha colecionável pronta, detalhes finos e acabamento profissional. Perfeita para colecionadores.",
    specs: { "Material": "PLA (impresso)", "Dimensões aproximadas": "80 x 45 x 40 mm", "Acabamento": "Detalhado" },
    reviews: [
      { author: "Maria L.", rating: 5, text: "Acabamento incrível, detalhado." },
    ],
  },
  {
    id: "vaso-black",
    name: "Vaso para Plantas - Preto",
    category: "Modelos Prontos",
    price: 29.9,
    pixPrice: 26.9,
    image: vaso,
    images: [vaso, productHero3d],
    tag: "Promoção",
    description: "Peça vaso para plantas, acabamento opaco preto. Ideal para protótipos de apresentação.",
    specs: { "Material": "PLA (impresso)", "Dimensões aproximadas": "100 x 50 x 30 mm", "Uso": "Exposição / Protótipo" },
    reviews: [],
  },
  {
    id: "porta-palhetas-grey",
    name: "Peça Porta Palhetas - Cinza",
    category: "Modelos Prontos",
    price: 19.9,
    pixPrice: 16.9,
    image: portapaleta,
    images: [portapaleta, productHero3d],
    description: "Peça porta palhetas pronta, impressa em PETG para maior resistência ao impacto. Indicada para encaixes e protótipos funcionais.",
    specs: { "Material": "PETG (impresso)", "Dimensões aproximadas": "70 x 40 x 30 mm", "Resistência": "Alta" },
    reviews: [
      { author: "João V.", rating: 4, text: "Resistente e funcional." },
    ],
  },
  {
    id: "porta-canetas-preto",
    name: "Porta Canetas - Preto",
    category: "Modelos Prontos",
    price: 29.9,
    pixPrice: 26.9,
    image: portacaneta,
    images: [portacaneta, productHero3d],
    description: "Porta canetas pronto em PLA preto, visual elegante ideal para organização de mesa.",
    specs: { "Material": "PLA (impresso)", "Dimensões aproximadas": "45 x 25 x 6 mm", "Acabamento": "Preto" },
    reviews: [],
  },
  {
    id: "suporte-headset-black",
    name: "Suporte para Headset - Preto",
    category: "Modelos Prontos",
    price: 39.9,
    pixPrice: 34.9,
    image: suporteheadset,
    images: [suporteheadset, productHero3d],
    tag: "Lançamento",
    description: "Suporte para headset pronto, maior escala e detalhes impressos em PETG para maior durabilidade.",
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
