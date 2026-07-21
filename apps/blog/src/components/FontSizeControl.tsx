import { useEffect, useState, type MouseEvent } from 'react';
import { Plus, Minus } from 'lucide-react';

const MIN_SIZE = 14;
const MAX_SIZE = 28;
const DEFAULT_SIZE = 20;

export function FontSizeControl() {
  const [fontSize, setFontSize] = useState(DEFAULT_SIZE);

  useEffect(() => {
    // Restaura tamanho salvo
    const saved = localStorage.getItem('post-font-size');
    if (saved) {
      const size = parseInt(saved, 10);
      if (!isNaN(size) && size >= MIN_SIZE && size <= MAX_SIZE) {
        setFontSize(size);
        applyFontSize(size);
      }
    }
  }, []);

  const applyFontSize = (size: number) => {
    document.documentElement.style.setProperty('--post-font-size', `${size}px`);
  };

  const handleIncrease = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newSize = Math.min(fontSize + 1, MAX_SIZE);
    setFontSize(newSize);
    applyFontSize(newSize);
    localStorage.setItem('post-font-size', String(newSize));
  };

  const handleDecrease = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newSize = Math.max(fontSize - 1, MIN_SIZE);
    setFontSize(newSize);
    applyFontSize(newSize);
    localStorage.setItem('post-font-size', String(newSize));
  };

  return (
    <div className="inline-flex items-center gap-1 rounded-full border px-2 py-2 shadow-sm" style={{
      borderColor: 'var(--color-border)',
      backgroundColor: 'var(--color-bg-card)',
    }}>
      <button
        type="button"
        onClick={handleDecrease}
        disabled={fontSize <= MIN_SIZE}
        aria-label="Diminuir tamanho da fonte"
        title="Diminuir (A-)"
        className="inline-flex items-center justify-center p-1 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:text-text-highlight"
        style={{
          color: 'var(--color-text-body)',
        }}
      >
        <Minus size={16} aria-hidden="true" />
      </button>

      <span
        className="text-xs font-medium min-w-8 text-center"
        style={{
          color: 'var(--color-text-body)',
        }}
      >
        {fontSize}px
      </span>

      <button
        type="button"
        onClick={handleIncrease}
        disabled={fontSize >= MAX_SIZE}
        aria-label="Aumentar tamanho da fonte"
        title="Aumentar (A+)"
        className="inline-flex items-center justify-center p-1 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:text-text-highlight"
        style={{
          color: 'var(--color-text-body)',
        }}
      >
        <Plus size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
