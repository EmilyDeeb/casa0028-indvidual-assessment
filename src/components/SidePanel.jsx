export default function SidePanel({ city, citations, onClose }) {
  if (!city) {
    return (
      <div style={{ padding: 16, borderLeft: "1px solid #eee" }}>
        <h2 style={{ marginTop: 0 }}>Palestinian Literary Map</h2>
        <p>Click a city to read excerpts and sources.</p>
      </div>
    );
  }

  const { city_name } = city.properties;

  return (
    <div style={{ padding: 16, borderLeft: "1px solid #eee", overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <h2 style={{ marginTop: 0 }}>{city_name}</h2>
        <button onClick={onClose} style={{ height: 36 }}>✕</button>
      </div>

      <p style={{ opacity: 0.7, marginTop: -8 }}>
        {citations.length} excerpt{citations.length !== 1 ? "s" : ""}
      </p>

      <div style={{ display: "grid", gap: 12 }}>
        {citations.map((c) => (
          <div key={`${c.city_id}-${c.log_id}`} style={{ padding: 12, border: "1px solid #eee", borderRadius: 12 }}>
            <div style={{ fontWeight: 600 }}>{c.author}</div>
            <div style={{ fontSize: 13, opacity: 0.75 }}>{c.work}</div>

            <p style={{ whiteSpace: "pre-line", marginTop: 8 }}>
              {c.sentence}
            </p>

            <a href={c.source_url} target="_blank" rel="noreferrer">
              Source
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
