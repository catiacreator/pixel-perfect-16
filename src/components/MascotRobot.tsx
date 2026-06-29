import "./hero-robot.css";

// Versão mini da mascote — apenas paira (flutua) e pisca os olhos.
// Sem cenas, balões nem interação.
export default function MascotRobot({ scale = 0.2 }: { scale?: number }) {
  return (
    <div className="hero-robot" style={{ ["--scale" as string]: String(scale) } as React.CSSProperties}>
      <div className="stage" style={{ cursor: "default" }}>
        <div className="robot">
          <div className="spinner">
            <div className="shadow" />
            <span className="arm l" />
            <span className="arm r" />
            <div className="body" />
            <div className="neck" />
            <div className="head">
              <div className="screen">
                <span className="eye" />
                <span className="eye" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
