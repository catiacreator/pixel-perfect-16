import { useEffect, useRef } from "react";
import "./hero-robot.css";
import { conteudoRobot } from "@/data/robot-conteudo";

const SCENES = ["s-laptop", "s-butterfly", "s-rain", "s-sun", "s-love"];
const ACTS = ["intro", ...SCENES];
const INTRO_MS = 8000; // acena + roda + ri
const SCENE_MS = 6000; // cada cena
const AUTO_EVERY_MS = 30000; // uma animação automática a cada 30s

export default function HeroRobot() {
  const stageRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const rainRef = useRef<HTMLDivElement>(null);
  const playRef = useRef<(() => void) | null>(null);

  // Balão ao clicar
  const lastPhrase = useRef(-1);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showBubble() {
    const bubble = bubbleRef.current;
    if (!bubble) return;
    let i: number;
    do {
      i = Math.floor(Math.random() * conteudoRobot.length);
    } while (i === lastPhrase.current && conteudoRobot.length > 1);
    lastPhrase.current = i;
    bubble.textContent = conteudoRobot[i];
    bubble.classList.add("show");
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => bubble.classList.remove("show"), 4500);
  }

  function handleClick() {
    // ao clicar, tanto pode dar uma animação como uma frase
    if (Math.random() < 0.5 && playRef.current) {
      playRef.current();
    } else {
      showBubble();
    }
  }

  // Gerar gotas de chuva (uma vez)
  useEffect(() => {
    const rain = rainRef.current;
    if (!rain || rain.childElementCount > 0) return;
    for (let i = 0; i < 40; i++) {
      const d = document.createElement("div");
      d.className = "drop";
      d.style.left = Math.random() * 100 + "%";
      d.style.animationDuration = 0.5 + Math.random() * 0.5 + "s";
      d.style.animationDelay = Math.random() * 1 + "s";
      d.style.opacity = String(0.4 + Math.random() * 0.6);
      rain.appendChild(d);
    }
  }, []);

  // Agendador de cenas: intro ao carregar, depois uma animação a cada 30s
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let last = -1;
    let clearTimer: ReturnType<typeof setTimeout> | undefined;

    const clearAll = () => stage.classList.remove("intro", ...SCENES);

    const playAct = () => {
      clearAll();
      if (clearTimer) clearTimeout(clearTimer);
      let a: number;
      do {
        a = Math.floor(Math.random() * ACTS.length);
      } while (a === last && ACTS.length > 1);
      last = a;
      const cls = ACTS[a];
      void stage.offsetWidth; // reinicia a animação
      stage.classList.add(cls);
      clearTimer = setTimeout(() => stage.classList.remove(cls), cls === "intro" ? INTRO_MS : SCENE_MS);
    };
    playRef.current = playAct;

    // intro ao carregar
    clearAll();
    void stage.offsetWidth;
    stage.classList.add("intro");
    last = 0;
    const introClear = setTimeout(() => stage.classList.remove("intro"), INTRO_MS);

    // uma animação automática a cada 30s
    const interval = setInterval(playAct, AUTO_EVERY_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(introClear);
      if (clearTimer) clearTimeout(clearTimer);
      stage.classList.remove("intro", ...SCENES);
    };
  }, []);

  return (
    <div className="hero-robot">
      <div className="stage intro" ref={stageRef} onClick={handleClick}>
        <div className="bubble" ref={bubbleRef} />

        {/* props ambientais */}
        <div className="sun" />
        <div className="rain" ref={rainRef} />

        <div className="robot">
          <div className="spinner">
            <div className="shadow" />

            <div className="laptop">
              <div className="lid">
                <div className="code">
                  <span /><span /><span /><span />
                </div>
              </div>
              <div className="base" />
            </div>
            <div className="net">
              <div className="hoop"><div className="mesh" /></div>
              <div className="handle" />
            </div>

            <span className="arm l" />
            <span className="arm r" />

            <div className="body" />
            <div className="neck" />

            <div className="head">
              <div className="think"><i /><i /><i /></div>
              <div className="screen"><span className="eye" /><span className="eye" /></div>
              <div className="shades"><span className="lens l" /><span className="lens r" /><span className="bridge" /></div>
            </div>

            <div className="butterfly"><span className="wing l" /><span className="wing r" /><span className="bf-body" /></div>

            <div className="umbrella"><div className="canopy" /><div className="pole" /><div className="handle-u" /></div>
          </div>
        </div>

        {/* segundo robô + corações */}
        <div className="robot2"><div className="head2"><div className="scr2"><span className="e2" /><span className="e2" /></div></div><div className="body2" /></div>
        <div className="hearts"><span className="heart" /><span className="heart" /><span className="heart" /><span className="heart" /><span className="heart" /></div>

        <div className="hint">✨ clica em mim</div>
      </div>
    </div>
  );
}
