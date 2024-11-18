import { Field, Label, Select } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { cn } from "@/utils/cn";

interface CustomSelectProps {
  className?: string;
  label: string;
  onChange?: (value: string) => void;
  options: { value: string; label: string }[];
  value: string;
}

export const CustomSelect = ({
  className,
  label,
  onChange,
  options,
  value
}: CustomSelectProps) => (
  <div className={cn("w-full", className)}>
    <Field>
      <Label className="sr-only">{label}</Label>
      <div className="relative">
        <Select
          className={cn(
            "block w-full appearance-none rounded-md border-none bg-[#EBEBE6] px-3 py-2",
            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25",
            "*:text-black"
          )}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <ChevronDownIcon
          className="group pointer-events-none absolute right-2.5 top-2.5 size-4 fill-black/60"
          aria-hidden="true"
        />
      </div>
    </Field>
  </div>
);
