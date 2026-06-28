import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { subscribeToast } from "@/lib/toast";

type Item = { id: number; msg: string };
let counter = 0;

export default function AppToaster() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    return subscribeToast((msg) => {
      const id = ++counter;
      setItems((s) => [...s, { id, msg }]);
      setTimeout(() => setItems((s) => s.filter((i) => i.id !== id)), 2600);
    });
  }, []);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
      {items.map((i) => (
        <div
          key={i.id}
          className="pointer-events-auto flex items-center gap-2.5 rounded-full bg-ink text-cream pl-2 pr-4 py-2 text-sm font-medium shadow-[0_14px_34px_-12px_rgba(0,0,0,0.55)] fade-up"
        >
          <span className="w-6 h-6 rounded-full bg-success flex items-center justify-center text-white shrink-0">
            <Check size={13} strokeWidth={3} />
          </span>
          {i.msg}
        </div>
      ))}
    </div>
  );
}
