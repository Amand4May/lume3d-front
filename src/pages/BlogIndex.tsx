import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import useSEO from "@/hooks/useSEO";
import { posts } from "@/data/blog/posts";

const BlogIndex = () => {
  useSEO({
    title: "Blog — Lume 3D",
    description: "Tutoriais e guias sobre impressão 3D, melhores práticas e escolha de filamentos.",
    url: typeof window !== "undefined" ? window.location.href : undefined,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container py-8 flex-1">
        <h1 className="text-2xl font-bold mb-6">Blog</h1>
        <div className="space-y-4">
          {posts.map((p) => (
            <article key={p.slug} className="bg-surface border border-border rounded-md p-4">
              <Link to={`/blog/${p.slug}`} className="text-lg font-semibold hover:text-primary">
                {p.title}
              </Link>
              <p className="text-sm text-muted-foreground">{p.description}</p>
              <div className="text-xs text-muted-foreground mt-2">Publicado em {p.datePublished} — {p.author}</div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogIndex;
