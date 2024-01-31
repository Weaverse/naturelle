import {Drawer as VaulDrawer} from 'vaul';

export function Drawer({children}) {
  return (
    <VaulDrawer.Root direction="top">
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
