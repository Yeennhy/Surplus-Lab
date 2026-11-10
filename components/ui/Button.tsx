"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "success" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-serif font-bold tracking-wider rounded-xl transition-all duration-200 select-none focus:outline-none focus:ring-2 focus:ring-[#d4a359]/50 active:translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0";

    const variants = {
      primary:
        "border-2 border-[#541f1a] bg-[#802f28] text-[#fcf3dc] shadow-md hover:bg-[#96372f] hover:shadow-lg active:bg-[#6e2721]",
      success:
        "border-2 border-[#1c3326] bg-[#2d4d3a] text-[#fcf3dc] shadow-md hover:bg-[#385f47] hover:shadow-lg active:bg-[#233d2e]",
      secondary:
        "border-2 border-[#8a7253] bg-[#e6d8ba] text-[#4a3826] shadow-sm hover:bg-[#dcd0b0] hover:text-[#2c1e13] active:bg-[#c9bb98]",
      danger:
        "border-2 border-[#631b14] bg-[#a33327] text-white shadow-md hover:bg-[#b83b2e] active:bg-[#7d221a]",
      outline:
        "border-2 border-[#8a7253] bg-transparent text-[#e5dac1] hover:bg-[#222b26] hover:text-white",
    };

    const sizes = {
      sm: "px-3.5 py-1.5 text-xs gap-1.5",
      md: "px-5 py-2.5 text-sm gap-2",
      lg: "px-7 py-3.5 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
