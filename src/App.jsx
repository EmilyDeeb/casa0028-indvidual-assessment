import { useMemo, useState, useRef } from "react";
import "./styles.css";
import { points } from "./data/points.js";
import { citations } from "./data/citations.js";
import MapView from "./components/MapView";
import FloatingPoems from "./components/FloatingPoems.jsx";
import WelcomeModal from "./components/WelcomeModal.jsx";

export default function App() {
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const mapRef = useRef(null);

  const citationsByCity = useMemo(() => {
    const acc = {};
    for (const city of citations?.cities ?? []) {
      acc[city.city_id] = (city.citations ?? []).map((c) => ({
        ...c,
        city_id: city.city_id,
        city_name: city.city_name,
        ar_city_name: city.ar_city_name,
      }));
    }
    return acc;
  }, []);

  const selectedCity = useMemo(() => {
    if (!selectedCityId) return null;
    return points?.features?.find(
      (f) => f?.properties?.city_id === selectedCityId
    ) ?? null;
  }, [selectedCityId]);

  const selectedCitations = useMemo(() => {
    if (!selectedCityId) return [];
    return [...(citationsByCity[selectedCityId] ?? [])].sort(
      (a, b) => Number(a.log_id) - Number(b.log_id)
    );
  }, [selectedCityId, citationsByCity]);

  const handleZoomOut = () => {
    if (window.handleMapZoomOut) window.handleMapZoomOut();
    setSelectedCityId(null);
  };

  const handleCityClick = (cityId) => {
    console.log("🔍 Clicked city:", cityId);
    console.log("🗺️ mapRef.current:", mapRef.current);
    
    setSelectedCityId(cityId);
    const feature = points.features.find(f => f.properties.city_id === cityId);
    if (feature && mapRef.current) {
      const [lon, lat] = feature.geometry.coordinates;
      mapRef.current.flyTo({ center: [lon, lat], zoom: 10, essential: true });
    } else {
      console.log("❌ No map ref or feature");
    }
  };

  const filteredCities = points?.features?.filter(feature =>
    feature.properties.city_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getCitationCount = (cityId) => citationsByCity[cityId]?.length || 0;

  return (
    <div className="layout">

      {/* Side Panel */}
      <div className="sidePanel">
        <div className="sidePanelHeader">
          <h3 className="sidePanelTitle">Cities</h3>
          <p className="sidePanelSubtext">{points?.features?.length || 0} cities</p>
        </div>
        <input
          type="text"
          placeholder="Search cities..."
          className="sidePanelSearch"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="cityList">
          {filteredCities.map(feature => {
            const cityId = feature.properties.city_id;
            return (
              <div
                key={cityId}
                className={`cityListItem ${selectedCityId === cityId ? 'active' : ''}`}
                onClick={() => handleCityClick(cityId)}
              >
                <div className="cityListName">{feature.properties.city_name}</div>
                <div className="cityListCount">
                  {getCitationCount(cityId)} poem{getCitationCount(cityId) !== 1 ? 's' : ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Map */}
      <div className="mapWrap">
        <MapView
          cities={points}
          selectedCityId={selectedCityId}
          onSelectCity={handleCityClick}
          onZoomOut={handleZoomOut}
          mapRefCallback={(ref) => { mapRef.current = ref.current; }}
        />

        {/* Floating Poems */}
        {selectedCityId && selectedCity && (
          <FloatingPoems
            city={selectedCity}
            citations={selectedCitations}
            onClose={() => setSelectedCityId(null)}
            mapRef={mapRef}
          />
        )}
      </div>

      {/* Title */}
      <div className="titleOverlay">
        <div>🌿 Poems for Palestine 🌿</div>
        <button className="zoomOutButton" onClick={handleZoomOut}>
          ← Zoom Out
        </button>
      </div>

      {/* Welcome Modal */}
      <WelcomeModal
        isOpen={showWelcome}
        onClose={() => setShowWelcome(false)}
      />

    </div>
  );
}