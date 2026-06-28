import { useState } from "react";
import { Save, Check } from "lucide-react";
import { notifySaved } from "@/lib/toast";

export default function SaveBar({
  onSave,
  label = "Salvar",
  savedMsg = "Guardado ✓",
  extra,
}: {
  onSave: () => void;
  label?: string;
  savedMsg?: string;
  extra?: React.ReactNode;
}) {
  const [saved, setSaved] = useState(false);
  const handle = () => {
    onSave();
    setSaved(true);
    notifySaved(savedMsg);
    setTimeout(() => setSaved(false), 1800);
  };
  return (
    <div className="flex flex-wrap gap-3 items-center mt-4">
      <button
        onClick={handle}
        className="text-sm font-semibold px-4 py-2 rounded-full bg-ink text-cream flex items-center gap-1.5"
      >
        {saved ? <Check size={14} /> : <Save size={14} />} {saved ? "Salvo" : label}
      </button>
      {extra}
    </div>
  );
}
