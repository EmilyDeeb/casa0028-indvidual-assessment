export default function CityModal({ isOpen, feature, citations = [], onClose }) {
if (!isOpen) return null;

  const cityName = feature?.properties?.city_name ?? "City";

  return (
    <div className="modalBackdrop" onClick={onClose}>
      <div className="modalCard" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <div>
            <h2 className="modalTitle">{cityName}</h2>
            <p className="modalSub">{citations.length} excerpt{citations.length === 1 ? "" : "s"}</p>
          </div>
          <button className="modalClose" onClick={onClose}>✕</button>
        </div>

        <div className="modalBody">
          {citations.map((c) => (
            <div key={c.log_id ?? `${c.work}-${c.author}`} className="quoteCard">
              <div className="quoteMeta">
                <div className="quoteWork">{c.work}</div>
                <div className="quoteAuthor">{c.author}</div>
              </div>

              <p className="quoteText">{c.sentence}</p>

              {c.source_url && (
                <a className="quoteLink" href={c.source_url} target="_blank" rel="noreferrer">
                  Source ↗
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
