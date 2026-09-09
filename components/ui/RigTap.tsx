import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

/** A large, tappable control with the app's press-feedback treatment. */
export const RigTap = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(function RigTap({ className = "", type = "button", ...props }, ref) {
  return (
    <button ref={ref} type={type} className={`rig-tap ${className}`} {...props} />
  );
});
