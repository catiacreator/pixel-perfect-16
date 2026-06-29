import { useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";

/**
 * Botão de gravação de voz → texto, via reconhecimento de voz do browser
 * (Web Speech API). Funciona em Chrome/Edge sobre HTTPS ou localhost.
 * Chama `onText` com cada troço transcrito (final).
 */
export default function MicButton({
  onText,
  disabled,
  className = "",
}: {
  onText: (text: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(true);
  const recRef = useRef<any>(null);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSupported(!!SR);
    return () => {
      try {
        recRef.current?.stop();
      } catch {
        /* ignore */
      }
    };
  }, []);

  const start = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "pt-PT";
    rec.interimResults = false;
    rec.continuous = true;
    rec.onresult = (e: any) => {
      let finalText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript;
      }
      finalText = finalText.trim();
      if (finalText) onText(finalText);
    };
    rec.onend = () => setRecording(false);
    rec.onerror = () => setRecording(false);
    recRef.current = rec;
    try {
      rec.start();
      setRecording(true);
    } catch {
      setRecording(false);
    }
  };

  const stop = () => {
    try {
      recRef.current?.stop();
    } catch {
      /* ignore */
    }
    setRecording(false);
  };

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={recording ? stop : start}
      disabled={disabled}
      aria-label={recording ? "Parar gravação" : "Gravar áudio"}
      title={recording ? "Parar e transcrever" : "Gravar áudio (a Liv.IA transcreve)"}
      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
        recording
          ? "bg-red-500 text-white animate-pulse"
          : "border border-[var(--color-border)] text-ink/60 hover:bg-ink/5 hover:text-ink"
      } ${className}`}
    >
      {recording ? <Square size={14} strokeWidth={2.5} /> : <Mic size={16} strokeWidth={1.9} />}
    </button>
  );
}
