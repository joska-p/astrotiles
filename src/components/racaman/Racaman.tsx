import { Sidebar, SidebarProvider, SidebarTrigger } from "@ui/sidebar";
import { useEffect, useRef, useState } from "react";
import Canvas from "./canvas";
import Controls from "./controls";
import { createRacamanSequence } from "./lib/sequence";
import Vectors from "./vectors";

const Racaman = () => {
  const [sequence, setSequence] = useState<number[]>(createRacamanSequence(50));
  const [drawMode, setDrawMode] = useState("vector-mode");
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      setContainerSize({
        width: containerRef.current?.offsetWidth ?? containerSize.width,
        height: containerRef.current?.offsetHeight ?? containerSize.height,
      });
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <SidebarProvider>
      <div className="relative h-dvh w-full content-center" ref={containerRef}>
        {drawMode === "vector-mode" && (
          <Vectors sequence={sequence} containerSize={containerSize} />
        )}
        {drawMode === "canvas-mode" && <Canvas sequence={sequence} containerSize={containerSize} />}
        <SidebarTrigger variant="ghost" className="absolute right-2 top-2 bg-sidebar" />
      </div>

      <Sidebar side="right" variant="floating">
        <Controls
          setSequence={setSequence}
          sequenceLength={sequence.length}
          setDrawMode={setDrawMode}
          drawMode={drawMode}
        />
      </Sidebar>
    </SidebarProvider>
  );
};

export default Racaman;
