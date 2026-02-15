import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

export default function MapView({ cities, selectedCityId, onSelectCity }) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [35.2, 31.9], // lon, lat (roughly Palestine)
      zoom: 7,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }));

    map.on("load", () => {
      map.addSource("cities", { type: "geojson", data: cities });

      // glow layer
      map.addLayer({
        id: "cities-glow",
        type: "circle",
        source: "cities",
        paint: {
          "circle-radius": 14,
          "circle-color": "rgb(255, 0, 76)",
          "circle-opacity": 0.25,
          "circle-blur": 0.9,
        },
      });

      // main points
      map.addLayer({
        id: "cities-points",
        type: "circle",
        source: "cities",
        paint: {
          "circle-radius": 6,
          "circle-color": "rgb(255, 243, 247)",
          "circle-stroke-width": 2,
          "circle-stroke-color": "rgb(255, 0, 76)",
        },
      });

      map.on("click", "cities-points", (e) => {
        const feature = e.features?.[0];
        const cityId = feature?.properties?.city_id;
        if (!cityId) return;
        onSelectCity(cityId);

        const [lon, lat] = feature.geometry.coordinates;
        map.flyTo({ center: [lon, lat], zoom: 10, essential: true });
      });

      map.on("mouseenter", "cities-points", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "cities-points", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    mapRef.current = map;

    return () => map.remove();
  }, [cities, onSelectCity]);

  // Optional: update selected styling later (not necessary for MVP)

  return <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />;
}
