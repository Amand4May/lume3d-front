/**
 * Utilitários para compartilhamento em redes sociais
 * Usa metadados already set no head via useSEO hook
 */

export interface ShareOptions {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  hashtags?: string[];
}

/**
 * Gera link de compartilhamento para WhatsApp
 * @example
 * const whatsappUrl = generateWhatsAppLink({
 *   title: 'Confira este filamento 3D',
 *   url: 'https://lume3d.com/produto/123'
 * });
 * window.open(whatsappUrl);
 */
export function generateWhatsAppLink(options: ShareOptions): string {
  const { title = '', url = '' } = options;
  const message = encodeURIComponent(`${title}\n\n${url}`);
  return `https://wa.me/?text=${message}`;
}

/**
 * Gera link de compartilhamento para WhatsApp Business (grupo específico)
 */
export function generateWhatsAppBusinessLink(
  phoneNumber: string,
  options: ShareOptions
): string {
  const { title = '', url = '' } = options;
  const message = encodeURIComponent(`${title}\n\n${url}`);
  return `https://wa.me/${phoneNumber}?text=${message}`;
}

/**
 * Gera link de compartilhamento para Facebook
 */
export function generateFacebookLink(options: ShareOptions): string {
  const { url = '' } = options;
  const params = new URLSearchParams({
    href: url,
    quote: options.title || '',
    hashtag: options.hashtags?.[0] || '',
  });
  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
}

/**
 * Gera link de compartilhamento para Twitter/X
 */
export function generateTwitterLink(options: ShareOptions): string {
  const { title = '', url = '', hashtags = [] } = options;
  const params = new URLSearchParams({
    text: title,
    url,
    hashtags: hashtags.join(','),
  });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

/**
 * Gera link de compartilhamento para LinkedIn
 */
export function generateLinkedInLink(options: ShareOptions): string {
  const { url = '', title = '', description = '' } = options;
  const params = new URLSearchParams({
    url,
    title,
    summary: description,
    source: 'Lume3D',
  });
  return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
}

/**
 * Gera link de compartilhamento por email
 */
export function generateEmailLink(options: ShareOptions): string {
  const { title = '', description = '', url = '' } = options;
  const subject = encodeURIComponent(title);
  const body = encodeURIComponent(`${description}\n\n${url}`);
  return `mailto:?subject=${subject}&body=${body}`;
}

/**
 * Gera link de compartilhamento para Telegram
 */
export function generateTelegramLink(options: ShareOptions): string {
  const { title = '', url = '' } = options;
  const params = new URLSearchParams({
    url,
    text: title,
  });
  return `https://t.me/share/url?${params.toString()}`;
}

/**
 * Hook para copiar texto para área de transferência
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Erro ao copiar para área de transferência:', error);
    // Fallback para navegadores mais antigos
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  }
}

/**
 * Detecta se está em dispositivo mobile
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Gera opções de compartilhamento recomendadas
 */
export function getRecommendedShareOptions(): ShareOptions {
  // Usa metadados já configurados no head
  const title = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
  const description = document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
  const image = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
  const url = document.querySelector('meta[property="og:url"]')?.getAttribute('content') || 
              document.querySelector('link[rel="canonical"]')?.getAttribute('href') ||
              window.location.href;

  return {
    title,
    description,
    image,
    url,
    hashtags: ['Lume3D', 'Impressão3D', 'Filamentos3D'],
  };
}

/**
 * Abre link de compartilhamento em nova janela
 */
export function openShareLink(
  url: string,
  width = 600,
  height = 600
): Window | null {
  const left = (screen.width - width) / 2;
  const top = (screen.height - height) / 2;
  return window.open(
    url,
    'share',
    `width=${width},height=${height},left=${left},top=${top}`
  );
}
