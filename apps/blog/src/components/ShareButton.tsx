import { useState, type MouseEvent } from 'react';
import { Check, Share2 } from 'lucide-react';

interface ShareButtonProps {
  /** Absolute or root-relative URL of the post. Defaults to current page. */
  url?: string;
  title: string;
  text?: string;
  /** Compact icon-only style for cards in the listing. */
  compact?: boolean;
}

/**
 * Share via Web Share API when available; falls back to clipboard copy.
 * Client-only (needs navigator).
 */
export function ShareButton({ url, title, text, compact = false }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const resolveUrl = () => {
    if (url) {
      if (url.startsWith('http://') || url.startsWith('https://')) return url;
      if (typeof window !== 'undefined') {
        return `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
      }
      return url;
    }
    if (typeof window !== 'undefined') return window.location.href;
    return '';
  };

  const handleShare = async (event: MouseEvent) => {
    // Prevent parent <a> navigation when used inside a card link.
    event.preventDefault();
    event.stopPropagation();

    const shareUrl = resolveUrl();
    const shareData: ShareData = {
      title,
      text: text ?? title,
      url: shareUrl,
    };

    try {
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        // canShare is not available in all browsers that implement share.
        const canShare =
          typeof navigator.canShare !== 'function' || navigator.canShare(shareData);
        if (canShare) {
          await navigator.share(shareData);
          return;
        }
      }
    } catch (err) {
      // User cancelled the sheet — do not fall through to clipboard.
      if (err instanceof DOMException && err.name === 'AbortError') return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Last resort: noop — browser blocked clipboard without secure context.
    }
  };

  const label = copied ? 'Link copiado' : 'Compartilhar post';

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleShare}
        aria-label={label}
        title={label}
        className="inline-flex items-center justify-center rounded-full border p-1.5 transition-colors cursor-pointer hover:border-text-highlight/40"
        style={{
          borderColor: 'var(--color-border)',
          color: copied ? 'var(--color-text-highlight)' : 'var(--color-text-body)',
          backgroundColor: 'var(--color-bg-card)',
        }}
      >
        {copied ? <Check size={12} aria-hidden="true" /> : <Share2 size={12} aria-hidden="true" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={label}
      className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm shadow-sm transition-[colors,box-shadow] cursor-pointer"
      style={{
        borderColor: 'var(--color-border)',
        color: copied ? 'var(--color-text-highlight)' : 'var(--color-text-body)',
        backgroundColor: 'var(--color-bg-card)',
      }}
    >
      {copied ? <Check size={16} aria-hidden="true" /> : <Share2 size={16} aria-hidden="true" />}
      <span>{copied ? 'Copiado' : 'Compartilhar'}</span>
    </button>
  );
}
