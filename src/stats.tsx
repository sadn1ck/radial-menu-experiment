import { useEffect, useRef } from "react";
import Stats from "stats.js";

const StatsMonitor: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const statsRef = ref.current;
    if (statsRef === null) return;
    const stats = new Stats();
    stats.showPanel(0);
    statsRef.appendChild(stats.dom);

    const animate = () => {
      stats.update();
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    return () => {
      statsRef?.removeChild(stats.dom);
      stats.end();
    };
  }, []);
  return <div ref={ref}></div>;
};

export { StatsMonitor };
