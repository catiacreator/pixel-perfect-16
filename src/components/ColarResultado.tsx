export default function ColarResultado({ label, placeholder }: { label: string; placeholder?: string }) {
  return (
    <div className="mb-4">
      <label className="text-xs tracking-[0.1em] uppercase text-muted mb-1.5 block">{label}</label>
      <textarea
        rows={4}
        placeholder={placeholder || "Cole aqui o resultado que o ChatGPT te devolveu…"}
        className="w-full rounded-xl border border-border p-3 text-sm outline-none focus:border-terracotta resize-none"
      />
    </div>
  );
}
