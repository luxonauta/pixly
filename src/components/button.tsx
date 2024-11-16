import { Button } from "@headlessui/react";
import { cn } from "@/utils/cn";

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  className?: string;
}

export const CustomButton = ({
  label,
  className,
  ...props
}: CustomButtonProps) => (
  <Button
    className={cn(
      "inline-flex w-fit items-center gap-2 rounded-lg bg-[#171717] px-3 py-2 font-semibold text-[#EBEBE6] focus:outline-none data-[focus]:outline-1 data-[focus]:outline-[#DFDFDA]",
      className
    )}
    {...props}
  >
    {label}
  </Button>
);
