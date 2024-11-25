import { Field, Input, Label } from "@headlessui/react";
import { cn } from "@/utils/cn";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label: string;
}

export const CustomInput = ({
  className,
  label,
  onChange,
  ...props
}: CustomInputProps) => (
  <div className="w-full">
    <Field>
      <Label className="sr-only">{label}</Label>
      <Input
        {...props}
        className={cn(
          "block w-full rounded border-none bg-[#EBEBE6] px-3 py-2 placeholder:italic placeholder:text-[inherit] placeholder:opacity-60",
          "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25",
          className
        )}
        onChange={(e) => onChange?.(e)}
      />
    </Field>
  </div>
);
