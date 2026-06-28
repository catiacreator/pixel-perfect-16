import { useEffect, useState } from "react";
import { Check, AlertTriangle, AlertCircle } from "lucide-react";
import { subscribeToast, type ToastType } from "@/lib/toast";

type Item = { id: number; msg: string; type: ToastType };
let counter = 0;

const STYLES: Record<ToastType, { bg: string; Icon: typeof Check }> = {
  success: { bg: "bg-success", Icon: Check },
  warning: { bg: "bg-amber-500", Icon: AlertTriangle },
  error: { bg: "bg-red-600", Icon: AlertCircle },
};

export default function AppToaster() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    return subscribeToast(({ msg, type }) => {
      const id = ++counter;
      setItems((s) => [...s, { id, msg, type }]);
      setTimeout(() => setItems((s) => s.filter((i) => i.id !== id)), 3000);
    });
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-2 pointer-events-none">
      {items.map((i) => {
        const { bg, Icon } = STYLES[i.type];
        return (
          <div
            key={i.id}
            className={`pointer-events-auto flex items-center gap-2.5 rounded-xl ${bg} text-white pl-3 pr-4 py-2.5 text-sm font-medium shadow-[0_14px_34px_-12px_rgba(0,0,0,0.55)] fade-up`}
          >
            <Icon size={17} strokeWidth={2.5} className="shrink-0" />
            {i.msg}
          </div>
        );
      })}
    </div>
  );
}
