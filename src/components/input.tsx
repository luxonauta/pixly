import { Field, Input, Label } from "@headlessui/react";
import { cn } from "@/utils/cn";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className?: string;
}

export const CustomInput = ({
  label,
  className,
  onChange,
  ...props
}: CustomInputProps) => (
  <div className="w-full">
    <Field>
      <Label className="sr-only">{label}</Label>
      <Input
        {...props}
        className={cn(
          "block w-full rounded-lg border-none bg-[#EBEBE6] px-3 py-2 placeholder:text-[inherit]",
          "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25",
          className
        )}
        onChange={(e) => onChange?.(e)}
      />
    </Field>
  </div>
);
