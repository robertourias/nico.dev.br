"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export interface UsePictureInPictureReturn {
  isSupported: boolean;
  isOpen: boolean;
  pipWindow: Window | null;
  open: (options?: DocumentPictureInPictureOptions) => Promise<void>;
  close: () => void;
  toggle: (options?: DocumentPictureInPictureOptions) => Promise<void>;
}

function copyStylesheets(win: Window) {
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      const rules = Array.from(sheet.cssRules).map((r) => r.cssText).join("\n");
      const style = win.document.createElement("style");
      style.textContent = rules;
      win.document.head.appendChild(style);
    } catch {
      if (sheet.href) {
        const link = win.document.createElement("link");
        link.rel = "stylesheet";
        link.href = sheet.href;
        win.document.head.appendChild(link);
      }
    }
  }
  win.document.documentElement.className = document.documentElement.className;
}

export function usePictureInPicture(): UsePictureInPictureReturn {
  const [pipWindow, setPipWindow] = useState<Window | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const pipWindowRef = useRef<Window | null>(null);

  useEffect(() => {
    setIsSupported("documentPictureInPicture" in window);
  }, []);

  const close = useCallback(() => {
    pipWindowRef.current?.close();
  }, []);

  const open = useCallback(async (options?: DocumentPictureInPictureOptions) => {
    const pip = window.documentPictureInPicture;
    if (!pip) return;

    if (pip.window) {
      pipWindowRef.current = pip.window;
      setPipWindow(pip.window);
      return;
    }

    const win = await pip.requestWindow({ width: 320, height: 260, ...options });
    copyStylesheets(win);

    win.addEventListener(
      "pagehide",
      () => {
        pipWindowRef.current = null;
        setPipWindow(null);
      },
      { once: true }
    );

    pipWindowRef.current = win;
    setPipWindow(win);
  }, []);

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
