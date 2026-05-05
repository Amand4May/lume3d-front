import { useState } from 'react';
import { 
  Share2, 
  MessageCircle, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail,
  Copy,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  generateWhatsAppLink,
  generateFacebookLink,
  generateTwitterLink,
  generateLinkedInLink,
  generateEmailLink,
  copyToClipboard,
  getRecommendedShareOptions,
  openShareLink,
} from '@/lib/share-utils';

interface ShareButtonProps {
  /** Mostrar apenas ícone ou com texto */
  variant?: 'icon' | 'full';
  /** Tamanho do botão */
  size?: 'sm' | 'md' | 'lg';
  /** Classes CSS customizadas */
  className?: string;
}

/**
 * Componente de compartilhamento em redes sociais
 * Usa automaticamente metadados já configurados via useSEO
 * 
 * @example
 * <ShareButton variant=\"full\" />
 * 
 * @example
 * // Com WhatsApp específico
 * <ShareButton variant=\"icon\" size=\"lg\" />
 */
export function ShareButton({ 
  variant = 'full', 
  size = 'md',
  className = ''
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const shareOptions = getRecommendedShareOptions();

  const handleCopyLink = async () => {
    if (shareOptions.url) {
      const success = await copyToClipboard(shareOptions.url);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleWhatsApp = () => {
    const url = generateWhatsAppLink(shareOptions);
    openShareLink(url, 600, 600);
  };

  const handleWhatsAppBusiness = () => {
    // Ajuste com seu número de WhatsApp Business
    const phoneNumber = '5515996289226'; // Exemplo: seu número
    const message = encodeURIComponent(
      `Olá! Confira este produto na Lume 3D:\n\n${shareOptions.title}\n${shareOptions.url}`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleFacebook = () => {
    const url = generateFacebookLink(shareOptions);
    openShareLink(url, 600, 600);
  };

  const handleTwitter = () => {
    const url = generateTwitterLink(shareOptions);
    openShareLink(url, 600, 600);
  };

  const handleLinkedIn = () => {
    const url = generateLinkedInLink(shareOptions);
    openShareLink(url, 600, 600);
  };

  const handleEmail = () => {
    const url = generateEmailLink(shareOptions);
    window.location.href = url;
  };

  const buttonSize = size === 'lg' ? 'h-10 w-10' : size === 'sm' ? 'h-8 w-8' : 'h-9 w-9';

  if (variant === 'icon') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant=\"ghost\" 
            size=\"icon\"
            className={`${buttonSize} ${className}`}
            title=\"Compartilhar\"
          >
            <Share2 className=\"h-5 w-5\" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align=\"end\" className=\"w-48\">
          <DropdownMenuItem onClick={handleWhatsApp} className=\"cursor-pointer gap-2\">
            <MessageCircle className=\"h-4 w-4 text-green-500\" />
            <span>WhatsApp</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleFacebook} className=\"cursor-pointer gap-2\">
            <Facebook className=\"h-4 w-4 text-blue-600\" />
            <span>Facebook</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleTwitter} className=\"cursor-pointer gap-2\">
            <Twitter className=\"h-4 w-4 text-sky-500\" />
            <span>X (Twitter)</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleLinkedIn} className=\"cursor-pointer gap-2\">
            <Linkedin className=\"h-4 w-4 text-blue-700\" />
            <span>LinkedIn</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleEmail} className=\"cursor-pointer gap-2\">
            <Mail className=\"h-4 w-4 text-gray-600\" />
            <span>Email</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleCopyLink} className=\"cursor-pointer gap-2\">
            {copied ? (
              <>
                <CheckCircle className=\"h-4 w-4 text-green-500\" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy className=\"h-4 w-4\" />
                <span>Copiar link</span>
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Variant completo com botões visíveis
  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        variant=\"outline\"
        size=\"sm\"
        onClick={handleWhatsApp}
        className=\"gap-2 flex-1\"
        title=\"Compartilhar no WhatsApp\"
      >
        <MessageCircle className=\"h-4 w-4 text-green-500\" />
        <span className=\"hidden sm:inline\">WhatsApp</span>
      </Button>

      <Button
        variant=\"outline\"
        size=\"sm\"
        onClick={handleFacebook}
        className=\"gap-2 flex-1\"
        title=\"Compartilhar no Facebook\"
      >
        <Facebook className=\"h-4 w-4 text-blue-600\" />
        <span className=\"hidden sm:inline\">Facebook</span>
      </Button>

      <Button
        variant=\"outline\"
        size=\"sm\"
        onClick={handleTwitter}
        className=\"gap-2 flex-1\"
        title=\"Compartilhar no Twitter\"
      >
        <Twitter className=\"h-4 w-4 text-sky-500\" />
        <span className=\"hidden sm:inline\">X</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant=\"outline\" size=\"sm\" className=\"gap-2\">
            <Share2 className=\"h-4 w-4\" />
            <span className=\"hidden sm:inline\">Mais</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align=\"end\">
          <DropdownMenuItem onClick={handleLinkedIn} className=\"cursor-pointer gap-2\">
            <Linkedin className=\"h-4 w-4 text-blue-700\" />
            <span>LinkedIn</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleEmail} className=\"cursor-pointer gap-2\">
            <Mail className=\"h-4 w-4\" />
            <span>Email</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleCopyLink} className=\"cursor-pointer gap-2\">
            {copied ? (
              <>
                <CheckCircle className=\"h-4 w-4 text-green-500\" />
                <span>Link copiado!</span>
              </>
            ) : (
              <>
                <Copy className=\"h-4 w-4\" />
                <span>Copiar link</span>
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default ShareButton;
