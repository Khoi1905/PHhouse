import Image from "next/image";
import clsx from "clsx";

const SIZES = {
  sm: { icon: 24, text: "text-base" },
  md: { icon: 32, text: "text-lg" },
  lg: { icon: 48, text: "text-2xl" },
} as const;

export function Logo({ size = "md", className }: { size?: keyof typeof SIZES; className?: string }) {
  const s = SIZES[size];
  return (
    <div className={clsx("flex items-center gap-2", className)}>
      <Image src="/logo-icon.png" alt="" width={s.icon} height={s.icon} priority />
      <span className={clsx("font-sans font-extrabold uppercase tracking-tight text-brand-navy", s.text)}>
        PH House
      </span>
    </div>
  );
}
