export type Post = {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  author: string;
  image?: string;
  content: string; // HTML
};

export const posts: Post[] = [
  {
    slug: "como-escolher-filamento",
    title: "Como escolher o filamento para sua impressão 3D",
    description: "Guia rápido para escolher entre PLA, PETG, ABS e TPU de acordo com uso e acabamento.",
    datePublished: "2025-09-01",
    author: "Lume 3D",
    image: "/src/assets/impresso3dazul.webp",
    content: `
      <p>Escolher o filamento certo depende do objetivo da peça: resistência, acabamento, flexibilidade e facilidade de impressão.</p>
      <h2>PLA</h2>
      <p>Fácil de imprimir, bom acabamento, ideal para protótipos e peças decorativas.</p>
      <h2>PETG</h2>
      <p>Boa resistência mecânica e resistência química, indicado para peças funcionais.</p>
      <h2>ABS</h2>
      <p>Alta resistência térmica e mecânica, requer mesa aquecida e ambiente controlado.</p>
      <h2>TPU</h2>
      <p>Filamento flexível, indicado para peças elásticas e amortecimento.</p>
    `,
  },
];
