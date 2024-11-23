import { Button } from "@headlessui/react";
import { cn } from "@/utils/cn";

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  icon?: React.ReactNode;
  label: string;
}

export const CustomButton = ({
  className,
  icon,
  label,
  ...props
}: CustomButtonProps) => (
  <Button
    className={cn(
      "inline-flex w-fit items-center justify-center gap-1 rounded bg-[#171717] px-3 py-2 font-semibold leading-tight text-[#EBEBE6] focus:outline-none data-[focus]:outline-1 data-[focus]:outline-[#DFDFDA]",
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
