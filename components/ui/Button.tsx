import { forwardRef, type ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Variant = "ghost" | "primary" | "save" | "danger";

const VARIANT_CLASSES: Record<Variant, string> = {
  ghost: "border-[1.5px] border-line bg-transparent text-muted-2",
  primary: "bg-ink text-paper",
  save: "bg-moss text-paper",
  danger: "bg-[#9C4A4A] text-white",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>(function Button({ variant = "primary", className, ...props }, ref) {
  return (
    <button
      ref={ref}
      {...props}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-[9px] px-[18px] py-2.5 font-sans text-[13.5px] font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35",
        VARIANT_CLASSES[variant],
        className
      )}
    />
  );
});
