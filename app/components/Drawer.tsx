import {Drawer as VaulDrawer} from 'vaul';

export function Drawer({children, open, onOpenChange}) {
  return (
    <VaulDrawer.Root direction="top" open={open} onOpenChange={onOpenChange}>
      <VaulDrawer.Trigger asChild>
        <button>MENU</button>
      </VaulDrawer.Trigger>
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className="fixed inset-0 bg-black/40" />
        <VaulDrawer.Content className="bg-white flex flex-col h-fit w-full fixed top-0">
          {children}
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
}
