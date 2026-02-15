import { useMemo, useState } from "react";
import MapView from "./components/MapView";
import SidePanel from "./components/SidePanel";
import points from "./data/points.geojson";
import citations from "./data/citations.json";
import TitleBar from "./components/TitleBar";
import "./styles.css";

export default function App() {
  const [selectedCityId, setSelectedCityId] = useState(null);

  const citationsByCity = useMemo(() => {
    return citations.reduce((acc, item) => {
      (acc[item.city_id] ||= []).push(item);
      return acc;
    }, {});
  }, []);

  const selectedCitations = selectedCityId
    ? (citationsByCity[selectedCityId] || []).sort(
        (a, b) => Number(a.log_id) - Number(b.log_id)
      )
    : [];

  const selectedCity = selectedCityId
    ? points.features.find(
        (f) => f.properties.city_id === selectedCityId
      )
    : null;

  return (
    <div className="layout">
      <TitleBar title="Citation Explorer" />
      <MapView
        cities={points}
        selectedCityId={selectedCityId}
        onSelectCity={setSelectedCityId}
      />
      <SidePanel
        city={selectedCity}
        citations={selectedCitations}
        onClose={() => setSelectedCityId(null)}
      />
    </div>
  );
}
