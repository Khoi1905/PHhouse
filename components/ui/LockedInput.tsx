import { forwardRef, type InputHTMLAttributes } from "react";
import clsx from "clsx";

export const LockedInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function LockedInput({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        {...props}
        className={clsx(
          "w-full rounded-field border-[1.5px] border-dashed border-locked-border bg-locked-bg px-3 py-2.5 font-sans text-sm text-ink outline-none transition-colors placeholder:text-locked-placeholder focus:border-sale-lock",
          className
        )}
      />
    );
  }
);
