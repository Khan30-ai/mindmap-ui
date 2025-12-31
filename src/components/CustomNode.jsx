import { Handle, Position } from "reactflow";
import { useState, useRef, useCallback } from "react";

export default function CustomNode({ data }) {
  const { label, fullData, onHover } = data;
  const [showTooltip, setShowTooltip] = useState(false);//for tooltip visibility
  const hoverTimeoutRef = useRef(null); //to avoid flicker 
  const isHovering = useRef(false);

  const handleMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {   //clears any pending hoverout timeout
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    if (!isHovering.current) {
      isHovering.current = true;
      setShowTooltip(true);
      onHover?.(fullData); //notify parent about hovered node
    }
  }, [fullData, onHover]);

  const handleMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {   //small delay prevents tooltip flickering
      isHovering.current = false;
      setShowTooltip(false);
      onHover?.(null);
    }, 100);
  }, [onHover]);

  return (
    <div
      className="relative bg-blue-100 border-2 border-blue-600 rounded-xl px-4 py-3 text-sm shadow-lg cursor-pointer hover:bg-blue-50 transition-colors select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ minWidth: "100px" }}
    >
      {/* left handle incoming connection */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: "#2563eb",
          width: 10,
          height: 10,
          border: "2px solid white",
        }}
      />
    {/*Node label */}
      <div className="pointer-events-none whitespace-nowrap text-center">
        {label}
      </div>

      {/* right handle outgoing connection */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: "#2563eb",
          width: 10,
          height: 10,
          border: "2px solid white",
        }}
      />

      {/* tooltip summary*/}
      {showTooltip && fullData?.summary && (
        <div
          className="absolute left-full top-1/2 ml-3 -translate-y-1/2
                     w-72 bg-white border border-gray-300
                     rounded-lg shadow-xl p-3 text-sm z-50
                     pointer-events-none"
        >
          <strong className="block mb-1">Summary</strong>
          <p className="text-gray-700">{fullData.summary}</p>
        </div>
      )}
    </div>
  );
}
