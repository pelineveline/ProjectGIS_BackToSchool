import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';

const MapComponent = ({ geojsonData }) => {
  const styleFeature = (feature) => ({
    fillColor: feature.properties.color || 'blue',
    weight: 2,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.7,
  });

  return (
    <div className="w-full h-screen">
      <MapContainer center={[0, 0]} zoom={2} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <GeoJSON data={geojsonData} style={styleFeature} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
