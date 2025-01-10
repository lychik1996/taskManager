import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';
interface PageLoaderProps{
  className?:string
}
export default function PageLoader({className}:PageLoaderProps) {
  return (
    <div className={cn(
      "flex items-center justify-center h-screen",
      className
    )}>
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}
