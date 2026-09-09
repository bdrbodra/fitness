import type { HTMLAttributes } from "react";

/**
 * The Industry design system's wireframe frame: a hairline border plus four
 * crosshair registration marks at the corners. Used for every card and
 * primary figure in the app.
 */
export function Blueprint({
  className = "",
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`blueprint border border-ink/16 ${className}`} {...rest}>
      <i className="corner tl" />
      <i className="corner tr" />
      <i className="corner bl" />
      <i className="corner br" />
      {children}
    </div>
  );
}
