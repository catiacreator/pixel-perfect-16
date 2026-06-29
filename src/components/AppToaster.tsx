import { useEffect, useState } from "react";
import { Check, AlertTriangle, AlertCircle } from "lucide-react";
import { subscribeToast, type ToastType } from "@/lib/toast";

type Item = { id: number; msg: string; type: ToastType };
let counter = 0;

const STYLES: Record<ToastType, { color: string; Icon: typeof Check }> = {
  success: { color: "#14B88A", Icon: Check }, // verde esmeralda claro
  warning: { color: "#F59E0B", Icon: AlertTriangle },
  error: { color: "#EF4444", Icon: AlertCircle },
};

export default function AppToaster() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    return subscribeToast(({ msg, type }) => {
      const id = ++counter;
      setItems((s) => [...s, { id, msg, type }]);
      setTimeout(() => setItems((s) => s.filter((i) => i.id !== id)), 3200);
    });
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-3 pointer-events-none">
      {items.map((i) => {
        const { color, Icon } = STYLES[i.type];
        return (
          <div
            key={i.id}
            style={{ backgroundColor: color }}
            className="pointer-events-auto flex items-center gap-3 rounded-2xl text-white pl-3 pr-5 py-3.5 text-[15px] font-semibold shadow-[0_20px_46px_-14px_rgba(0,0,0,0.45)] ring-1 ring-white/15 fade-up max-w-[92vw]"
          >
            <span className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center shrink-0">
              <Icon size={19} strokeWidth={2.75} />
            </span>
            {i.msg}
          </div>
        );
      })}
    </div>
  );
}
