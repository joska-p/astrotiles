import React, { useEffect, useRef } from "react";
import { drawSvg } from "./lib/draw";

type Props = {
  sequence: number[];
  containerSize: { width: number; height: number };
};

const Vectors = ({ sequence, containerSize }: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const styleObject = {
    "--dasharray": 0,
    "--dashoffset": 0,
    strokeDasharray: "var(--dasharray)",
    strokeDashoffset: "var(--dashoffset)",
    strokeWidth: 1,
    stroke: "currentColor",
  } as React.CSSProperties;

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (svgRef.current) drawSvg(svgRef.current, sequence, containerSize);
    }, 100);
    return () => {
      clearTimeout(debounce);
    };
  }, [svgRef, sequence, containerSize]);

  return <svg ref={svgRef} style={styleObject} className="max-h-full fill-transparent" />;
};

export default Vectors;
