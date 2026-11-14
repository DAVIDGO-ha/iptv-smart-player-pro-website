"use client"
import { useState } from "react"
import { Check, Copy } from "lucide-react"

export function CopyButton({ text, className = "" }: { text: string; className?: string }) {
  const [done, setDone] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(text) } catch {
      const t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove()
    }
    setDone(true); setTimeout(() => setDone(false), 1800)
  }
  return (
    <button onClick={copy} className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold transition hover:bg-white/20 ${className}`} aria-label="Copy link">
      {done ? <><Check className="h-4 w-4 text-cyan" /> Copied</> : <><Copy className="h-4 w-4" /> Copy</>}
    </button>
  )
}
