import { Menu, MenuButton, MenuItems } from "@headlessui/react";

interface DropdownMenuProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
}

export const DropdownMenu = ({ children, trigger }: DropdownMenuProps) => (
  <Menu>
    <MenuButton>{trigger}</MenuButton>
    <MenuItems
      transition
      anchor="bottom start"
      className="origin-top-right rounded-lg border border-black/15 bg-[#EBEBE6] px-3.5 pb-4 pt-5 shadow-lg transition duration-100 ease-out [--anchor-gap:.75rem] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
    >
      {children}
    </MenuItems>
  </Menu>
);
