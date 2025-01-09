import { useMedia } from 'react-use';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

import { Drawer, DrawerContent } from '@/components/ui/drawer';

interface ResponsiveModalProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ResponsiveModal({
  children,
  onOpenChange,
  open,
}: ResponsiveModalProps) {
  const isDesktop = useMedia('(min-width:1024px)', true);
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange} >
        <DialogContent
          aria-describedby={undefined}
          className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]"
        >
          <DialogTitle className="sr-only">Dialog Title</DialogTitle>
          {children}
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={onOpenChange} >
      <DrawerContent aria-describedby={undefined}>
        <DialogTitle className="sr-only">Dialog Title</DialogTitle>
        <div className="overflow-y-auto hide-scrollbar max-h-[85vh]">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
