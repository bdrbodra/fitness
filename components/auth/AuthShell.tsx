import type { ReactNode } from "react";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[420px] flex-col justify-center gap-6 px-5 py-10">
      <div className="flex items-center gap-1.5">
        <div className="flex h-[26px] w-[26px] items-center justify-center bg-accent font-heading text-[17px] font-semibold leading-none text-paper">
          B
        </div>
        <span className="font-heading text-[21px] font-semibold leading-none tracking-[.14em]">
          BRUNO
        </span>
      </div>
      <div>
        <div className="font-heading text-[28px] font-semibold leading-[1.05]">{title}</div>
        <div className="mt-1.5 text-[13px] text-neutral-700">{subtitle}</div>
      </div>
      {children}
    </div>
  );
}
