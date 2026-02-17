import { useState } from "react";

export default function SidePanel({ cities, citationsByCity, onSelectCity }) {
  const [searchTerm, setSearchTerm] = useState("");

  if (!cities || !cities.features) {
    return (
      <div className="sidePanel">
        <p>Loading cities...</p>
      </div>
    );
  }

  const filteredCities = cities.features.filter(feature => 
    feature.properties.city_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCitationCount = (cityId) => {
    return citationsByCity[cityId]?.length || 0;
  };

  return (
    <div className="sidePanel">
      <div className="sidePanelHeader">
        <h3 className="sidePanelTitle">Cities</h3>
        <p className="sidePanelSubtext">{cities.features.length} cities</p>
      </div>

      <input 
        type="text"
        placeholder="Search cities..."
        className="sidePanelSearch"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="cityList">
        {filteredCities.length === 0 && <p style={{padding: "20px"}}>No cities found</p>}
        {filteredCities.map(feature => {
          const cityId = feature.properties.city_id;
          const citationCount = getCitationCount(cityId);
          
          return (
            <div 
              key={cityId}
              className="cityListItem"
              onClick={() => onSelectCity(cityId)}
            >
              <div className="cityListName">{feature.properties.city_name}</div>
              <div className="cityListCount">{citationCount} poem{citationCount !== 1 ? 's' : ''}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}