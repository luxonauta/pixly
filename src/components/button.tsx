import { Button } from "@headlessui/react";
import { cn } from "@/utils/cn";

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label: string;
  className?: string;
}

export const CustomButton = ({
  icon,
  label,
  className,
  ...props
}: CustomButtonProps) => (
  <Button
    className={cn(
      "inline-flex w-fit items-center gap-1 rounded-md bg-[#171717] px-3 py-2 font-semibold text-[#EBEBE6] focus:outline-none data-[focus]:outline-1 data-[focus]:outline-[#DFDFDA]",
      "transition duration-100 ease-[cubic-bezier(.36,.66,.6,1)] will-change-auto active:scale-[.96] active:opacity-90",
      {
        "pr-3.5": icon
      },
      className
    )}
    {...props}
  >
    {icon}
    <span className="mt-[.0625rem]">{label}</span>
  </Button>
);
