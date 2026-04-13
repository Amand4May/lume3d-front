import { useEffect } from "react";

type SEOOptions = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
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

export default function useSEO({ title, description, image, url, type = "website", siteName }: SEOOptions) {
  useEffect(() => {
    if (title) document.title = title;

    setMetaName("description", description);
    setMetaName("twitter:title", title ?? document.title);
    setMetaName("twitter:description", description);
    setMetaName("twitter:card", image ? "summary_large_image" : "summary");
    setMetaName("twitter:image", image);

    setMetaProperty("og:site_name", siteName ?? "Lume 3D");
    setMetaProperty("og:title", title ?? document.title);
    setMetaProperty("og:description", description);
    setMetaProperty("og:image", image);
    setMetaProperty("og:image:alt", description);
    setMetaProperty("og:type", type);

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
  }, [title, description, image, url, type, siteName]);
}

