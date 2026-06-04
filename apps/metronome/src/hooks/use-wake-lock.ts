import { useEffect, useRef } from 'react';

export function useWakeLock(isActive: boolean): void {
  const sentinelRef = useRef<WakeLockSentinel | null>(null);
  const isAcquiringRef = useRef(false);

  useEffect(() => {
    if (!('wakeLock' in navigator)) return;

    const acquire = async () => {
      if (isAcquiringRef.current) return;
      if (sentinelRef.current && !sentinelRef.current.released) return;

      isAcquiringRef.current = true;
      try {
        const sentinel = await navigator.wakeLock.request('screen');
        sentinelRef.current = sentinel;
        sentinel.addEventListener('release', () => {
          if (sentinelRef.current === sentinel) {
            sentinelRef.current = null;
          }
        });
      } catch (err) {
        console.warn('[useWakeLock] acquire failed:', err);
      } finally {
        isAcquiringRef.current = false;
      }
    };

    const release = async () => {
      const s = sentinelRef.current;
      if (s && !s.released) {
        sentinelRef.current = null;
        await s.release().catch(() => {});
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isActive) {
        acquire();
      }
    };

    if (isActive) {
      acquire();
    } else {
      release();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      release();
    };
  }, [isActive]);
}
