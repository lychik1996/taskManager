'use client';

import { MenuIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './ui/sheet';
import Sidebar from './sidebar';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useMedia } from 'react-use';

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isDesktop = useMedia('(min-width:1024px)', true);
  useEffect(() => {
    if(isDesktop){
      setIsOpen(false);
    }
    
  }, [pathname,isDesktop]);
  return (
    <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" className="lg:hidden ">
          <MenuIcon className="size-5 text-neutral-500 " />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="p-0" aria-describedby={undefined}>
        <SheetTitle className="sr-only"> Navigation menu</SheetTitle>
        <Sidebar  onClose={setIsOpen}/>
      </SheetContent>
    </Sheet>
  );
}
