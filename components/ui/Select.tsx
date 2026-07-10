import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & { options: readonly string[]; placeholder?: string }
>(function Select({ options, placeholder = "— Chọn —", className, ...props }, ref) {
  return (
    <div className="relative">
      <select
        ref={ref}
        {...props}
        className={clsx(
          "w-full appearance-none rounded-field border-[1.5px] border-line bg-white px-3 py-2.5 pr-9 font-sans text-sm text-ink outline-none focus:border-moss",
          className
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
      />
    </div>
  );
});
