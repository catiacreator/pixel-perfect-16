export default function ColarResultado({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  // Opcionais: quando fornecidos, o campo passa a controlado e guarda o valor.
  value?: string;
  onChange?: (v: string) => void;
}) {
  const controlado = value !== undefined && onChange !== undefined;
  return (
    <div className="mb-4">
      <label className="text-xs tracking-[0.1em] uppercase text-muted mb-1.5 block">{label}</label>
      <textarea
        rows={value ? 5 : 4}
        placeholder={placeholder || "Cole aqui o resultado que o ChatGPT te devolveu…"}
        className="w-full rounded-xl border border-border p-3 text-sm outline-none focus:border-terracotta resize-y"
        {...(controlado ? { value, onChange: (e) => onChange!(e.target.value) } : {})}
      />
    </div>
  );
}
