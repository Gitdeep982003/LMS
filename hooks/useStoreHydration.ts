import { useState, useEffect } from 'react';
import { useLmsStore } from '@/store/useLmsStore';

export function useStoreHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Check if store is rehydrated from localStorage
    const unsubHydrate = useLmsStore.persist.onFinishHydration(() => setHydrated(true));
    if (useLmsStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    return () => unsubHydrate();
  }, []);

  return hydrated;
}
