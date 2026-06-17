// components/FirebasePerfProvider.jsx
'use client';

import { useEffect } from 'react';
import { perf } from '@/lib/firebase';

interface ProviderProps {
  children: React.ReactNode;
}

export default function FirebasePerfProvider({ children }: ProviderProps) {
  useEffect(() => {
    if (perf) {
      console.log("Firebase Performance Monitoring initialized successfully.");
    }
  }, []);

  return <>{children}</>;
}
