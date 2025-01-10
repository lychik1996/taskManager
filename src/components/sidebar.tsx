import Image from 'next/image';
import Link from 'next/link';
import DottedSeparator from './dotted-separator';
import Navigation from './navigation';
import WorkspaceSwitcher from './workspace-switcher';
import Projects from './projects';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

export default function Sidebar() {
  return (
    <ScrollArea className='h-full bg-neutral-100'>
      <aside className="min-h-screen bg-neutral-100 p-4 w-full">
      <Link href="/">
        <Image src="/logo.svg" alt="logo" width={100} height={60}/>
      </Link>
      <DottedSeparator className="my-4" />
      <WorkspaceSwitcher />
      <DottedSeparator className="my-4" />
      <Navigation />
      <DottedSeparator className="my-4" />
      <Projects />
    </aside>
      <ScrollBar/>
    </ScrollArea>
    
  );
}
