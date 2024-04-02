import Graphic from "@arcgis/core/Graphic.js";
import Point from "@arcgis/core/geometry/Point.js";
import esriConfig from "@arcgis/core/config.js";
import Map from "@arcgis/core/Map.js";
import TextSymbol from "@arcgis/core/symbols/TextSymbol.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import MapView from "@arcgis/core/views/MapView.js";
import { useEffect } from "react";
import "./AcrgisMap.css";
import { useSelector } from "react-redux";

const AcrgisMap = () => {
  const places = useSelector((state) => state.trip.trip.places);
  const loadMap = () => {
    
    esriConfig.apiKey =
      "AAPKcfae0a2aa06142eba3996beda2e801e7AJDhip2daafTRE-PKB-wxdUxpoOAoJ3ymrFwjpx2AHEl3_hynuc-XYsGadlFcdMO";
    const placesLayer = new GraphicsLayer({
      id: "placesLayer",
    });
    const map = new Map({
      basemap: "arcgis/navigation",
      layers: [placesLayer],
    });
    let view;
    if (places.length > 0) {
      view = new MapView({
        map: map,
        center: [places[0].place.location.x, places[0].place.location.y],
        zoom: 13,
        container: "viewDiv",
      });
    } else {
      view = new MapView({
        map: map,
        zoom: 13,
        container: "viewDiv",
      });
    }

    const graphicsLayer = new GraphicsLayer({
      elevationInfo: {
        mode: "on-the-ground",
      },
    });
    map.add(graphicsLayer);

    function addGraphic(point, attributes) {
      const textSymbol = new TextSymbol({
        text: attributes.name,
        color: "black",
        font: {
          size: 12,
          family: "Arial",
        },
        haloColor: "white",
        haloSize: "1px",
      });
      const textGraphic = new Graphic({
        geometry: point,
        symbol: textSymbol,
      });
      view.graphics.add(textGraphic);
    }

    view.when(() => {
      places.map((place) => {
        const attributes = {
          name: place.place.name || "Place",
          location: `${place.place.location.x}, ${place.place.location.y}`,
        };
        addGraphic(
          new Point([place.place.location.x, place.place.location.y]),
          attributes
        );
      });
    });
  };

  useEffect(() => {
    loadMap();
  }, [places]);

  return (
    <>
      <div
        id="viewDiv"
        className="map-container"
      ></div>
      
    </>
  );
};

export default AcrgisMap;
