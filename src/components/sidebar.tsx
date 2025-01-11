import Image from 'next/image';
import Link from 'next/link';
import DottedSeparator from './dotted-separator';
import Navigation from './navigation';
import WorkspaceSwitcher from './workspace-switcher';
import Projects from './projects';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

interface SidebarProps{
  onClose?:Function;
}
export default function Sidebar({onClose}:SidebarProps) {
  return (
    <ScrollArea className='h-full bg-neutral-100'>
      <aside className="min-h-screen bg-neutral-100 p-4 w-full">
      <Link href="/">
        <Image src="/logo.svg" alt="logo" width={100} height={60}/>
      </Link>
      <DottedSeparator className="my-4" />
      <WorkspaceSwitcher />
      <DottedSeparator className="my-4" />
      <Navigation onClose={onClose}/>
      <DottedSeparator className="my-4" />
      <Projects  onClose={onClose}/>
    </aside>
      <ScrollBar/>
    </ScrollArea>
    
  );
}
