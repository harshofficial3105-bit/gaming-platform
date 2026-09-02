'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DeveloperPreviewRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/creator/preview');
  }, [router]);

  return (
    <div className="py-20 text-center font-mono text-xs text-slate-400">
      Redirecting to Creator Sandbox Preview...
    </div>
  );
}