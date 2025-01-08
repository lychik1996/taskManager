'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader } from 'lucide-react';
import Link from 'next/link';

export default function LoadingPage() {
  return (
    <div className="h-screen flex flex-col  items-center justify-center">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}
