import { useState } from "react";

export default function CityModal({ isOpen, feature, citations = [], onClose }) {
  const [selectedPoet, setSelectedPoet] = useState(null);

  if (!isOpen) return null;

  const cityName = feature?.properties?.city_name ?? "City";

  // Get unique poets
  const poets = [...new Set(citations.map(c => c.author))];

  // Filter citations by selected poet
  const filteredCitations = selectedPoet 
    ? citations.filter(c => c.author === selectedPoet)
    : citations;

  return (
    <div className="modalBackdrop" onClick={onClose}>
      <div className="modalCard" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <div>
            <h2 className="modalTitle">{cityName}</h2>
            <p className="modalSub">
              {filteredCitations.length} excerpt{filteredCitations.length === 1 ? "" : "s"}
              {selectedPoet && ` by ${selectedPoet}`}
            </p>
          </div>
          <button className="modalClose" onClick={onClose}>✕</button>
        </div>

        {/* Poet Filter */}
        {poets.length > 1 && (
          <div className="poetFilter">
            <button 
              className={`poetFilterBtn ${!selectedPoet ? 'active' : ''}`}
              onClick={() => setSelectedPoet(null)}
            >
              All Poets
            </button>
            {poets.map(poet => (
              <button 
                key={poet}
                className={`poetFilterBtn ${selectedPoet === poet ? 'active' : ''}`}
                onClick={() => setSelectedPoet(poet)}
              >
                {poet}
              </button>
            ))}
          </div>
        )}

        {/* City Image - You'll add this */}
        <div className="cityImageContainer">
          <img 
            src={`/images/${feature?.properties?.city_id}.jpg`} 
            alt={cityName}
            className="cityImage"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>

        <div className="modalBody">
          {filteredCitations.map((c) => (
            <div key={c.log_id ?? `${c.author}-${c.work}`} className="quoteCard">
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