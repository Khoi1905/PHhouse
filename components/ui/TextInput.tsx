import { forwardRef, type InputHTMLAttributes } from "react";
import clsx from "clsx";

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function TextInput({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        {...props}
        className={clsx(
          "w-full rounded-field border-[1.5px] border-line bg-white px-3 py-2.5 font-sans text-sm text-ink outline-none transition-colors placeholder:text-placeholder focus:border-moss",
          className
        )}
      />
    );
  }
);
