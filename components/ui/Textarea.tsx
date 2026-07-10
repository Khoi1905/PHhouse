import { forwardRef, type TextareaHTMLAttributes } from "react";
import clsx from "clsx";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        {...props}
        className={clsx(
          "w-full resize-y rounded-field border-[1.5px] border-line bg-white px-3 py-2.5 font-sans text-sm text-ink outline-none transition-colors placeholder:text-placeholder focus:border-moss",
          className
        )}
      />
    );
  }
);
