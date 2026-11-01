import React from "react";
import { Link } from "react-router-dom";
import brandWordmark from "@/assets/jt-mark.svg";
import { cn } from "@/lib/utils";

export default function Logo({ className }) {
  return (
    <Link
      to="/"
      className={cn("inline-flex shrink-0 items-center no-underline", className)}
      aria-label="JT — Home"
    >
      <img
        src={brandWordmark}
        alt="JTPO_S"
        className="h-auto max-h-14 w-[116px] object-contain sm:w-[148px]"
        decoding="async"
      />
    </Link>
  );
}
