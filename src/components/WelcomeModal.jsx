export default function WelcomeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="welcomeBackdrop" onClick={onClose}>
      <div className="welcomeCard" onClick={(e) => e.stopPropagation()}>
        <div className="welcomeHeader">
          <h2 className="welcomeTitle">🌿 Welcome 🌿</h2>
          <button className="modalClose" onClick={onClose}>✕</button>
        </div>

        <div className="welcomeBody">
          <h3>How to use this map:</h3>
          <ol className="welcomeList">
            <li>
              <strong>Browse cities</strong> in the panel on the left
            </li>
            <li>
              <strong>Click on any city</strong> in the list or on the map
            </li>
            <li>
              <strong>Read poems</strong> floating around each city point
            </li>
            <li>
              <strong>Explore sources</strong> by clicking the "Source ↗" links
            </li>
            <li>
              <strong>Zoom out</strong> anytime using the button at the top
            </li>
          </ol>

          <p className="welcomeNote">
            This project celebrates Palestinian cities through poetry and literature, 
            preserving the cultural memory and connection to these beloved places.
          </p>

          <button className="welcomeButton" onClick={onClose}>
            Explore the Map →
          </button>
        </div>
      </div>
    </div>
  );
}