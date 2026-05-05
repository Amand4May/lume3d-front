import { useEffect } from "react";

type SEOOptions = {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  url?: string;
  type?: "website" | "article" | "product";
  siteName?: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
};

function setMetaName(name: string, content?: string) {
  if (!content) return;
  let el = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setMetaProperty(prop: string, content?: string) {
  if (!content) return;
  let el = document.head.querySelector(`meta[property="${prop}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", prop);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export default function useSEO({ 
  title, 
  description, 
  image, 
  imageAlt,
  url, 
  type = "website", 
  siteName,
  author,
  publishedDate,
  modifiedDate
}: SEOOptions) {
  useEffect(() => {
    if (title) document.title = title;

    // Meta tags básicas
    setMetaName("description", description);
    
    // Twitter Card (X/Twitter)
    setMetaName("twitter:title", title ?? document.title);
    setMetaName("twitter:description", description);
    setMetaName("twitter:card", image ? "summary_large_image" : "summary");
    setMetaName("twitter:image", image);
    if (imageAlt) setMetaName("twitter:image:alt", imageAlt);

    // Open Graph (Facebook, WhatsApp, LinkedIn, etc)
    setMetaProperty("og:site_name", siteName ?? "Lume 3D");
    setMetaProperty("og:title", title ?? document.title);
    setMetaProperty("og:description", description);
    setMetaProperty("og:image", image);
    if (imageAlt) setMetaProperty("og:image:alt", imageAlt);
    setMetaProperty("og:type", type);
    setMetaProperty("og:locale", "pt_BR");
    
    // Dimensões da imagem (recomendado pelo Facebook)
    if (image) {
      setMetaProperty("og:image:width", "1200");
      setMetaProperty("og:image:height", "630");
    }

    // Canonical URL
    if (url) {
      setMetaProperty("og:url", url);
      let link = document.head.querySelector("link[rel=\"canonical\"]") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", url);
    }

    // Meta tags adicionais para artigos
    if (type === "article" || publishedDate || modifiedDate || author) {
      if (publishedDate) setMetaProperty("article:published_time", publishedDate);
      if (modifiedDate) setMetaProperty("article:modified_time", modifiedDate);
      if (author) setMetaProperty("article:author", author);
      setMetaProperty("article:section", "Blog");
    }

  }, [title, description, image, imageAlt, url, type, siteName, author, publishedDate, modifiedDate]);
}

