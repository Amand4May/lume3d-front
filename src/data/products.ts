import suportetablet from "@/assets/suportetablet.jpeg";
import tabletsizes from "@/assets/tabletsizes.png";
import bonecokratos from "@/assets/bonecokratos.jpeg";
import kratossize from "@/assets/kratossize.png";
import bonecospiderman from "@/assets/bonecospiderman.jpeg";
import spidermansize from "@/assets/spidermansize.png";
import vaso from "@/assets/vaso.jpeg";
import vasosizes from "@/assets/vasosizes.png";
import portapaleta from "@/assets/portapaleta.jpeg";
import suportguitarpick from "@/assets/suportguitarpick.png";
import suporteheadset from "@/assets/suporteheadset.jpeg";
import suportheadset from "@/assets/suportheadset.png";
import portacaneta from "@/assets/portacaneta.jpeg";
import portacanetas from "@/assets/portacanetas.png";
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
    images: [suportetablet, tabletsizes],
    tag: "Promoção",
    description: "Suporte para tablet pronto, estilo moderno, impresso em PLA com acabamento liso. Ideal para uso diário e suporte de dispositivos.",
    specs: { "Material": "PLA (impresso)", "Dimensões aproximadas (C x L x A)": "13 x 23 x 4 cm", "Acabamento": "Liso / Pintura opcional" },
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
    images: [bonecokratos, kratossize],
    description: "Modelo boneco kratos pronto, detalhes finos e acabamento profissional. Ideal para colecionadores.",
    specs: { "Material": "PETG (impresso)", "Dimensões aproximadas (C x L x A)": "12 x 7 x 15 cm", "Uso": "Decoração / Display" },
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
    images: [bonecospiderman, spidermansize],
    description: "Miniatura Homem-Aranha colecionável pronta, detalhes finos e acabamento profissional. Perfeita para colecionadores.",
    specs: { "Material": "PLA (impresso)", "Dimensões aproximadas (C x L x A)": "10 x 5 x 15 cm", "Acabamento": "Detalhado" },
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
    images: [vaso, vasosizes],
    tag: "Promoção",
    description: "Peça vaso para plantas, acabamento opaco preto. Ideal para protótipos de apresentação.",
    specs: { "Material": "PLA (impresso)", "Dimensões aproximadas (C x L x A)": "7 x 7 x 10 cm", "Uso": "Exposição / Protótipo" },
    reviews: [],
  },
  {
    id: "porta-palhetas-grey",
    name: "Peça Porta Palhetas - Cinza",
    category: "Modelos Prontos",
    price: 19.9,
    pixPrice: 16.9,
    image: portapaleta,
    images: [portapaleta, suportguitarpick],
    description: "Peça porta palhetas pronta, impressa em PETG para maior resistência ao impacto. Indicada para encaixes e protótipos funcionais.",
    specs: { "Material": "PETG (impresso)", "Dimensões aproximadas (C x L x A)": "70 x 40 x 30 mm", "Resistência": "Alta" },
    reviews: [
      { author: "João V.", rating: 4, text: "Resistente e funcional." },
    ],
  },
  {
    id: "portacanetas",
    name: "Porta Canetas - Preto",
    category: "Modelos Prontos",
    price: 29.9,
    pixPrice: 26.9,
    image: portacaneta,
    images: [portacaneta, portacanetas],
    description: "Porta canetas pronto em PLA preto, visual elegante ideal para organização de mesa.",
    specs: { "Material": "PLA (impresso)", "Dimensões aproximadas (C x L x A)": "18,3 x 13,3 x 10 cm", "Acabamento": "Preto" },
    reviews: [],
  },
  {
    id: "suporte-headset-black",
    name: "Suporte para Headset - Preto",
    category: "Modelos Prontos",
    price: 39.9,
    pixPrice: 34.9,
    image: suporteheadset,
    images: [suporteheadset, suportheadset],
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
