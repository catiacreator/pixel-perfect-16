import { AlertCircle } from "lucide-react";

export default function TodoBanner({ texto }: { texto: string }) {
  return (
    <div className="mx-5 md:mx-10 mt-4 rounded-2xl border border-terracotta/40 bg-terracotta/5 p-3 max-w-3xl xl:mx-auto flex items-start gap-2">
      <AlertCircle size={14} className="text-terracotta flex-shrink-0 mt-0.5" />
      <p className="text-xs text-ink leading-relaxed">{texto}</p>
    </div>
  );
}
