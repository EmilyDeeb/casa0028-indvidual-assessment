import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function MapView({ cities, selectedCityId, onSelectCity, onZoomOut, mapRefCallback }) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  // 1) Initialize map ONCE
  useEffect(() => {
    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [34.0, 32.0],
      zoom: 7.5,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }));

    function handleClick(e) {
      const feature = e.features?.[0];
      if (!feature) return;
      const cityId = feature.properties?.city_id;
      if (!cityId) return;
      onSelectCity(cityId);
      const [lon, lat] = feature.geometry.coordinates;
      map.flyTo({ center: [lon, lat], zoom: 10, essential: true });
    }

    function handleMouseEnter() {
      map.getCanvas().style.cursor = "pointer";
    }
    function handleMouseLeave() {
      map.getCanvas().style.cursor = "";
    }

    map.on("load", () => {
      map.addSource("cities", { type: "geojson", data: cities });

      map.addLayer({
        id: "cities-glow",
        type: "circle",
        source: "cities",
        paint: {
          "circle-radius": 14,
          "circle-color": "rgb(255, 0, 76)",
          "circle-opacity": 0.18,
          "circle-blur": 0.9,
        },
      });

      map.addLayer({
        id: "cities-points",
        type: "circle",
        source: "cities",
        paint: {
          "circle-radius": [
            "case",
            ["==", ["get", "city_id"], selectedCityId],
            10,
            6,
          ],
          "circle-color": "rgb(255, 243, 247)",
          "circle-stroke-width": [
            "case",
            ["==", ["get", "city_id"], selectedCityId],
            3,
            2,
          ],
          "circle-stroke-color": "rgb(255, 0, 76)",
        },
      });

      // ADD LABELS
      map.addLayer({
        id: "cities-labels",
        type: "symbol",
        source: "cities",
        layout: {
          "text-field": ["get", "city_name"],
          "text-font": ["Open Sans Bold"],
          "text-size": 12,
          "text-offset": [0, 0.5],
          "text-anchor": "top",
        },
        paint: {
          "text-color": "rgb(255, 0, 76)",
          "text-halo-color": "#fff",
          "text-halo-width": 1.5,
        },
      });

      map.on("click", "cities-points", handleClick);
      map.on("mouseenter", "cities-points", handleMouseEnter);
      map.on("mouseleave", "cities-points", handleMouseLeave);
    });

    mapRef.current = map;

    return () => {
      if (map.getLayer("cities-points")) {
        map.off("click", "cities-points", handleClick);
        map.off("mouseenter", "cities-points", handleMouseEnter);
        map.off("mouseleave", "cities-points", handleMouseLeave);
      }
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Expose map ref to parent
  useEffect(() => {
    if (mapRef.current && mapRefCallback) {
      mapRefCallback(mapRef);
    }
  }, [mapRefCallback]);

  // 3) If cities data changes, update the source
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const source = map.getSource("cities");
    if (source && "setData" in source) {
      source.setData(cities);
    }
  }, [cities]);

  // 4) If selectedCityId changes, update the paint rules (highlight)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (map.getLayer("cities-points")) {
      map.setPaintProperty("cities-points", "circle-radius", [
        "case",
        ["==", ["get", "city_id"], selectedCityId],
        10,
        6,
      ]);
      map.setPaintProperty("cities-points", "circle-stroke-width", [
        "case",
        ["==", ["get", "city_id"], selectedCityId],
        3,
        2,
      ]);
    }
  }, [selectedCityId]);

  // Expose zoom out function
  useEffect(() => {
    if (onZoomOut && mapRef.current) {
      window.handleMapZoomOut = () => {
        mapRef.current.flyTo({
          center: [34.0, 32.0],
          zoom: 7.5,
          essential: true
        });
      };
    }
  }, [onZoomOut]);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: "100%", height: "100%" }}
    />
  );
}