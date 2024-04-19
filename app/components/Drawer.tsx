import {Drawer as VaulDrawer} from 'vaul';
import {IconClose} from './Icon';
import { cn } from "@/lib/utils";

interface DrawerProps {
  direction?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  trigger?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export function Drawer(props: DrawerProps) {
  let {
    children,
    trigger,
    open,
    onOpenChange,
    direction = 'top',
    className,
  } = props;
  return (
    <VaulDrawer.Root
      direction={direction}
      open={open}
      onOpenChange={onOpenChange}
    >
      <VaulDrawer.Trigger asChild>{trigger}</VaulDrawer.Trigger>
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className="fixed inset-0 bg-black/40" />
        <VaulDrawer.Content className={cn("z-50", className)}>
          <button className="absolute top-0 right-0 p-4" onClick={() => onOpenChange(false)}>
            <IconClose />
          </button>
          {children}
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
}
