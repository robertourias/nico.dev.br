import { useEffect, useRef, useState } from 'react';
import { HandMetal } from 'lucide-react';

const MAX_CLAPS_PER_USER = 50;
const DEBOUNCE_MS = 600;

interface ClapButtonProps {
  slug: string;
}

interface ClapsResponse {
  total: number;
  userClaps: number;
}

export function ClapButton({ slug }: ClapButtonProps) {
  const [total, setTotal] = useState<number | null>(null);
  const [userClaps, setUserClaps] = useState(0);
  const [floating, setFloating] = useState(false);
  const pendingRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = () => setFloating(window.scrollY > 80);
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/claps/${slug}`)
      .then((res) => (res.ok ? (res.json() as Promise<ClapsResponse>) : null))
      .then((data) => {
        if (cancelled || !data) return;
        setTotal(data.total);
        setUserClaps(data.userClaps);
      })
      .catch(() => {
        if (!cancelled) setTotal(0);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const flush = () => {
    const amount = pendingRef.current;
    if (amount === 0) return;
    pendingRef.current = 0;

    fetch(`/api/claps/${slug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    })
      .then((res) => (res.ok ? (res.json() as Promise<ClapsResponse>) : null))
      .then((data) => {
        if (!data) return;
        // Reconcilia com o servidor (fonte da verdade do cap e do total real).
        setTotal(data.total);
        setUserClaps(data.userClaps);
      })
      .catch(() => {
        // Mantém o estado otimista — o próximo GET (ex: reload) corrige qualquer divergência.
      });
  };

  const handleClap = () => {
    if (userClaps >= MAX_CLAPS_PER_USER) return;

    setTotal((current) => (current ?? 0) + 1);
    setUserClaps((current) => Math.min(current + 1, MAX_CLAPS_PER_USER));
    pendingRef.current += 1;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(flush, DEBOUNCE_MS);
  };

  const atCap = userClaps >= MAX_CLAPS_PER_USER;

  return (
    <button
      type="button"
      onClick={handleClap}
      disabled={atCap}
      aria-label={atCap ? 'Limite de claps atingido neste post' : 'Dar um clap neste post'}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm shadow-sm transition-[colors,box-shadow] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer ${
        floating ? 'fixed top-20 left-6 z-50 shadow-lg' : ''
      }`}
      style={{
        borderColor: 'var(--color-border)',
        color: atCap ? 'var(--color-text-highlight)' : 'var(--color-text-body)',
        backgroundColor: 'var(--color-bg-card)',
      }}
    >
      <HandMetal size={16} aria-hidden="true" />
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>
        {total === null ? '···' : total}
      </span>
    </button>
  );
}
