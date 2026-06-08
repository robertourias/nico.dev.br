'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

export interface UsePictureInPictureReturn {
  isSupported: boolean;
  isOpen: boolean;
  pipWindow: Window | null;
  open: (options?: DocumentPictureInPictureOptions) => Promise<void>;
  close: () => void;
  toggle: (options?: DocumentPictureInPictureOptions) => Promise<void>;
}

// Copies the host document's stylesheets into the PiP window so portaled
// content (Tailwind classes, CSS variables) renders correctly there —
// the PiP window is a separate browsing context with its own empty document.
function copyStylesheets(pipWindow: Window) {
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      const rules = Array.from(sheet.cssRules).map((rule) => rule.cssText).join('\n');
      const style = pipWindow.document.createElement('style');
      style.textContent = rules;
      pipWindow.document.head.appendChild(style);
    } catch {
      if (sheet.href) {
        const link = pipWindow.document.createElement('link');
        link.rel = 'stylesheet';
        link.href = sheet.href;
        pipWindow.document.head.appendChild(link);
      }
    }
  }

  pipWindow.document.documentElement.className = document.documentElement.className;
}

export function usePictureInPicture(): UsePictureInPictureReturn {
  const [pipWindow, setPipWindow] = useState<Window | null>(null);
  const isSupported = typeof window !== 'undefined' && 'documentPictureInPicture' in window;
  const pipWindowRef = useRef<Window | null>(null);

  const close = useCallback(() => {
    pipWindowRef.current?.close();
  }, []);

  const open = useCallback(
    async (options?: DocumentPictureInPictureOptions) => {
      const pip = window.documentPictureInPicture;
      if (!pip) return;

      if (pip.window) {
        pipWindowRef.current = pip.window;
        setPipWindow(pip.window);
        return;
      }

      const win = await pip.requestWindow({ width: 280, height: 140, ...options });
      copyStylesheets(win);

      win.addEventListener(
        'pagehide',
        () => {
          pipWindowRef.current = null;
          setPipWindow(null);
        },
        { once: true }
      );

      pipWindowRef.current = win;
      setPipWindow(win);
    },
    []
  );

  const toggle = useCallback(
    async (options?: DocumentPictureInPictureOptions) => {
      if (pipWindowRef.current) {
        close();
      } else {
        await open(options);
      }
    },
    [open, close]
  );

  useEffect(() => {
    return () => {
      pipWindowRef.current?.close();
    };
  }, []);

  return { isSupported, isOpen: pipWindow !== null, pipWindow, open, close, toggle };
}
