import { useEffect, useState } from "react";

export default function FloatingPoems({ city, citations, onClose, mapRef }) {
  const [positions, setPositions] = useState([]);
  const [centerPos, setCenterPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!city || !mapRef?.current) return;

    const map = mapRef.current;
    const [lon, lat] = city.geometry.coordinates;

    const updatePositions = () => {
      const center = map.project([lon, lat]);  // ← Changed from mapInstance to map
      setCenterPos({ x: center.x, y: center.y });

      const count = citations.length;
      const radius = 220;
      const minY = 250; // Minimum Y position (below title)
      
      const newPositions = citations.map((_, i) => {
        const angle = (2 * Math.PI / count) * i - Math.PI / 2;
        let x = center.x + Math.cos(angle) * radius;
        let y = center.y + Math.sin(angle) * radius;
        
        // Prevent poems from appearing too high (above title)
        if (y < minY) {
          y = minY;
        }
        
        return { x, y };
      });
      setPositions(newPositions);
    };

    updatePositions();
    map.on("move", updatePositions);
    map.on("zoom", updatePositions);

    return () => {
      map.off("move", updatePositions);
      map.off("zoom", updatePositions);
    };
  }, [city, mapRef, citations]);

  if (!city || !citations?.length || !positions.length) return null;

  return (
    <div className="floatingPoemsContainer">

      <svg style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 5,
      }}>
        {positions.map((pos, i) => (
          <line
            key={i}
            x1={centerPos.x}
            y1={centerPos.y}
            x2={pos.x}
            y2={pos.y}
            stroke="rgba(255, 0, 76, 0.4)"
            strokeWidth="2"
            strokeDasharray="6,4"
          />
        ))}
      </svg>

      <div
        className="floatingCenterPoint"
        style={{ left: `${centerPos.x}px`, top: `${centerPos.y}px` }}
      >
        <div className="cityPointPulse" />
      </div>

      {citations.map((citation, i) => {
        const pos = positions[i];
        if (!pos) return null;
        return (
          <div
            key={citation.log_id || i}
            className="floatingPoemBox"
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="floatingPoemMeta">
              <div className="floatingPoemWork">{citation.work}</div>
              <div className="floatingPoemAuthor">{citation.author}</div>
            </div>
            <p className="floatingPoemText">{citation.sentence}</p>
            {citation.source_url && (
              <a
                className="floatingPoemLink"
                href={citation.source_url}
                target="_blank"
                rel="noreferrer"
              >
                Source ↗
              </a>
            )}
          </div>
        );
      })}

      <button className="floatingCloseBtn" onClick={onClose}>
        ✕ Close
      </button>

    </div>
  );
}