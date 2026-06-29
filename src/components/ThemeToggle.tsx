import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const KEY = "leveza.theme";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    let isDark = false;
    try {
      isDark = localStorage.getItem(KEY) === "dark";
    } catch {
      /* sem acesso a localStorage */
    }
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(KEY, next ? "dark" : "light");
    } catch {
      /* ignora */
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Mudar para modo claro" : "Mudar para modo escuro"}
      className="w-10 h-10 rounded-full border border-ink/15 flex items-center justify-center text-ink/70 hover:bg-ink/5 hover:text-ink transition-colors"
    >
      {dark ? <Sun size={15} strokeWidth={1.75} /> : <Moon size={15} strokeWidth={1.75} />}
    </button>
  );
}
