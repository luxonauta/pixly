import { Field, Label, Select } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { cn } from "@/utils/cn";

interface CustomSelectProps {
  label: string;
  options: { value: string; label: string }[];
  className?: string;
  onChange?: (value: string) => void;
}

export const CustomSelect = ({
  label,
  options,
  className,
  onChange
}: CustomSelectProps) => (
  <div className={cn("w-full", className)}>
    <Field>
      <Label className="sr-only">{label}</Label>
      <div className="relative">
        <Select
          className={cn(
            "block w-full appearance-none rounded-lg border-none bg-[#EBEBE6] px-3 py-2",
            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25",
            "*:text-black"
          )}
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
