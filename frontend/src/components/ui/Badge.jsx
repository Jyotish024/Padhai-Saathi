import * as React from "react"
import { cn } from "../../lib/utils"

function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "border-transparent bg-blue-600/20 text-blue-400 hover:bg-blue-600/30",
    secondary: "border-transparent bg-zinc-800 text-zinc-100 hover:bg-zinc-700",
    destructive: "border-transparent bg-red-500/20 text-red-400 hover:bg-red-500/30",
    outline: "text-zinc-300 border-zinc-700",
  }
  return (
    <div className={cn("inline-flex items-center rounded-full border border-zinc-800 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none", variants[variant], className)} {...props} />
  )
}

export { Badge }
