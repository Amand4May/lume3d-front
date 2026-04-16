import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import useSEO from "@/hooks/useSEO";
import { posts } from "@/data/blog/posts";
import NotFound from "@/pages/NotFound";

const Article = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find((p) => p.slug === slug);

  useSEO({
    title: post ? `${post.title} — Lume 3D` : undefined,
    description: post?.description,
    image: post?.image,
    url: typeof window !== "undefined" ? window.location.href : undefined,
    type: "article",
  });

  if (!post) return <NotFound />;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.image ? [post.image] : undefined,
    author: { "@type": "Person", name: post.author },
    datePublished: post.datePublished,
    mainEntityOfPage: { "@type": "WebPage", "@id": typeof window !== "undefined" ? window.location.href : undefined },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container py-8 flex-1">
        <article className="prose max-w-none">
          <h1>{post.title}</h1>
          <p className="text-sm text-muted-foreground">{post.datePublished} — {post.author}</p>
          {post.image && <img src={post.image} alt={post.title} className="w-full object-cover rounded-md my-4" />}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </main>
      <Footer />
    </div>
  );
};

export default Article;
