import { useEffect, useRef } from "react";
import "./hero-robot.css";
import { conteudoRobot } from "@/data/robot-conteudo";

const SCENES = ["s-laptop", "s-butterfly", "s-rain", "s-sun", "s-love"];
const INTRO_MS = 8000; // acena + roda + ri
const SCENE_MS = 6000; // cada cena

export default function HeroRobot() {
  const stageRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const rainRef = useRef<HTMLDivElement>(null);

  // Balão ao clicar
  const lastPhrase = useRef(-1);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleClick() {
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

  // Agendador de cenas
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let lastScene = -1;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const clearScenes = () => SCENES.forEach((s) => stage.classList.remove(s));

    const runCycle = () => {
      stage.classList.add("intro");
      clearScenes();
      void stage.offsetWidth; // reinicia animações do intro

      timers.push(
        setTimeout(() => {
          stage.classList.remove("intro");
          let s: number;
          do {
            s = Math.floor(Math.random() * SCENES.length);
          } while (s === lastScene && SCENES.length > 1);
          lastScene = s;
          stage.classList.add(SCENES[s]);

          timers.push(
            setTimeout(() => {
              clearScenes();
              timers.push(setTimeout(runCycle, 1200));
            }, SCENE_MS),
          );
        }, INTRO_MS),
      );
    };

    runCycle();
    return () => {
      timers.forEach(clearTimeout);
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
