import { useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";

/**
 * Botão de gravação de voz → texto (Web Speech API), com barra de som ao vivo
 * (Web Audio API) para mostrar que está a gravar.
 * Funciona em Chrome/Edge sobre HTTPS ou localhost. Chama `onText` por cada troço final.
 */
const BAR_MULT = [0.55, 0.85, 1, 0.8, 0.6];

export default function MicButton({
  onText,
  disabled,
}: {
  onText: (text: string) => void;
  disabled?: boolean;
}) {
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(true);
  const recRef = useRef<any>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSupported(!!SR);
    return () => cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function cleanup() {
    try {
      recRef.current?.stop();
    } catch {
      /* ignore */
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
  }

  async function startMeter() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
      const ac: AudioContext = new AC();
      audioCtxRef.current = ac;
      const src = ac.createMediaStreamSource(stream);
      const analyser = ac.createAnalyser();
      analyser.fftSize = 256;
      src.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const x = (data[i] - 128) / 128;
          sum += x * x;
        }
        const rms = Math.sqrt(sum / data.length);
        const level = Math.min(1, rms * 3.2);
        const bars = barsRef.current?.children;
        if (bars) {
          for (let i = 0; i < bars.length; i++) {
            const h = Math.max(0.18, Math.min(1, level * BAR_MULT[i] + 0.08));
            (bars[i] as HTMLElement).style.transform = `scaleY(${h.toFixed(3)})`;
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      /* sem permissão de microfone — segue só com a transcrição */
    }
  }

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
    rec.onend = () => stop();
    rec.onerror = () => stop();
    recRef.current = rec;
    try {
      rec.start();
      setRecording(true);
      void startMeter();
    } catch {
      setRecording(false);
    }
  };

  const stop = () => {
    cleanup();
    setRecording(false);
  };

  if (!supported) return null;

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      {recording && (
        <div ref={barsRef} className="flex items-center gap-[3px] h-7 px-1.5" aria-hidden>
          {BAR_MULT.map((_, i) => (
            <span
              key={i}
              className="w-[3px] h-6 rounded-full bg-red-500 origin-center transition-none"
              style={{ transform: "scaleY(0.2)" }}
            />
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={recording ? stop : start}
        disabled={disabled}
        aria-label={recording ? "Parar gravação" : "Gravar áudio"}
        title={recording ? "Parar e transcrever" : "Gravar áudio (a Liv.IA transcreve)"}
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
          recording
            ? "bg-red-500 text-white"
            : "border border-[var(--color-border)] text-ink/60 hover:bg-ink/5 hover:text-ink"
        }`}
      >
        {recording ? <Square size={14} strokeWidth={2.5} /> : <Mic size={16} strokeWidth={1.9} />}
      </button>
    </div>
  );
}
