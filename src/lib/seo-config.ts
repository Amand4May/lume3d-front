// Configuração global de metadados para SEO
// Use este arquivo como base para meta tags em todas as páginas

export const SITE_CONFIG = {
  baseUrl: "https://lume3d-front.vercel.app",
  siteName: "Lume 3D",
  title: "Lume 3D - Filamentos e Impressão 3D",
  description: "Loja especializada em filamentos PLA, PETG e acessórios para impressão 3D profissional. Entrega rápida em todo Brasil.",
  image: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/97872a6b-a577-474c-81b6-45e0ded0b2f0/id-preview-eb3d3b1c--4aa80409-02df-4520-aa67-71d2c6f03a19.lovable.app-1773875940131.png",
  imageAlt: "Lume 3D - Filamentos e Impressão 3D",
  phone: "+55-15-996289226",
  email: "contato@lume3d.com", // Ajuste conforme necessário
  locale: "pt_BR",
  type: "website",
};

// Meta tags predefinidas para diferentes páginas
export const PAGE_METADATA = {
  home: {
    title: "Lume 3D - Filamentos e Impressão 3D",
    description: "Loja especializada em filamentos PLA, PETG e acessórios para impressão 3D profissional. Entrega rápida em todo Brasil.",
  },
  blog: {
    title: "Blog - Lume 3D",
    description: "Artigos, tutoriais e notícias sobre impressão 3D, filamentos e tecnologia.",
  },
  carrinho: {
    title: "Carrinho - Lume 3D",
    description: "Seus produtos selecionados para compra. Confira e finalize seu pedido.",
  },
  checkout: {
    title: "Checkout - Lume 3D",
    description: "Finalize sua compra de forma segura na Lume 3D.",
  },
  login: {
    title: "Entrar - Lume 3D",
    description: "Acesse sua conta Lume 3D.",
  },
  cadastro: {
    title: "Cadastro - Lume 3D",
    description: "Crie sua conta na Lume 3D.",
  },
  perfil: {
    title: "Meu Perfil - Lume 3D",
    description: "Gerencie sua conta, pedidos e dados na Lume 3D.",
  },
};

/**
 * Gera a URL completa de uma página
 * @param path Caminho relativo (ex: "/blog/artigo-1")
 */
export function getCanonicalUrl(path: string = "/"): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_CONFIG.baseUrl}${cleanPath}`;
}

/**
 * Gera os metadados de uma página de produto
 * @param product Dados do produto
 */
export function getProductMetadata(product: {
  name: string;
  description: string;
  image: string;
  price: number;
  id: string;
}) {
  return {
    title: `${product.name} - Lume 3D`,
    description: product.description,
    image: product.image,
    imageAlt: product.name,
    url: getCanonicalUrl(`/produto/${product.id}`),
    type: "product" as const,
  };
}

/**
 * Gera os metadados de um artigo do blog
 * @param article Dados do artigo
 */
export function getArticleMetadata(article: {
  title: string;
  description: string;
  image: string;
  slug: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
}) {
  return {
    title: `${article.title} - Lume 3D Blog`,
    description: article.description,
    image: article.image,
    imageAlt: article.title,
    url: getCanonicalUrl(`/blog/${article.slug}`),
    type: "article" as const,
    author: article.author,
    publishedDate: article.publishedDate,
    modifiedDate: article.modifiedDate,
  };
}
