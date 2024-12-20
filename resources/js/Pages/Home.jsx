import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Circle, Tooltip } from "react-leaflet";
import UserLayout from "@/Layouts/UserLayout";
import "leaflet/dist/leaflet.css";

const Home = () => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [filter, setFilter] = useState("All"); // State untuk filter

  // Fetch GeoJSON file dari public/sekolahOke.json
  useEffect(() => {
    fetch("/sekolahOke.json")
      .then((response) => response.json())
      .then((data) => setGeojsonData(data))
      .catch((error) => console.error("Error fetching GeoJSON:", error));
  }, []);

  // Style untuk fitur GeoJSON berdasarkan Nama_Sekol
  const styleFeature = (feature) => {
    const schoolType = feature.properties.Nama_Sekol.slice(0, 3).toUpperCase();

    if (schoolType === "SMA") {
      return { fillColor: "red", color: "red", weight: 2, fillOpacity: 0.8 };
    } else if (schoolType === "SMP") {
      return { fillColor: "blue", color: "blue", weight: 2, fillOpacity: 0.8 };
    } else if (schoolType === "SDN") {
      return { fillColor: "green", color: "green", weight: 2, fillOpacity: 0.8 };
    } else {
      return { fillColor: "gray", color: "gray", weight: 2, fillOpacity: 0.8 };
    }
  };

  // Render lingkaran berdasarkan GeoJSON dan filter
  const renderCircles = (filteredFeatures) => {
    if (filter === "NoCircle") return null; // Jangan render circle jika filter NoCircle dipilih

    return filteredFeatures.map((feature, index) => {
      const [lng, lat] = feature.geometry.coordinates;
      const schoolType = feature.properties.Nama_Sekol.slice(0, 3).toUpperCase();

      // Set warna berdasarkan tipe sekolah
      const color =
        schoolType === "SMA"
          ? "red"
          : schoolType === "SMP"
          ? "blue"
          : schoolType === "SDN"
          ? "green"
          : "gray";

      return (
        <Circle
          key={index}
          center={[lat, lng]}
          radius={100} // Radius dalam meter (1 km)
          pathOptions={{
            color: color,
            fillColor: color,
            fillOpacity: 0.3,
          }}
        >
          {/* Tooltip untuk lingkaran */}
          <Tooltip direction="top" offset={[0, 20]} opacity={1} permanent={false}>
            <div>
              <strong>{feature.properties.Nama_Sekol}</strong>
              <br />
              {feature.properties.Alamat}
            </div>
          </Tooltip>
        </Circle>
      );
    });
  };

  // Filter fitur GeoJSON berdasarkan pilihan
  const filteredFeatures =
    geojsonData?.features.filter((feature) => {
      const schoolType = feature.properties.Nama_Sekol.slice(0, 3).toUpperCase();
      return filter === "All" || filter === "NoCircle" || schoolType === filter;
    }) || [];

  return (
    <UserLayout>
      {/* Floating Filter */}
      <div
        className="absolute z-[1000] bg-white shadow-lg rounded p-4"
        style={{ top: "4rem", right: "1rem" }} // Letakkan di bawah navbar
      >
        <label htmlFor="filter" className="block text-sm font-medium mb-2">
          Filter School Type
        </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded"
        >
          <option value="All">All</option>
          <option value="SMA">SMA</option>
          <option value="SMP">SMP</option>
          <option value="SDN">SDN</option>
          <option value="NoCircle">No Circle</option> {/* Opsi untuk menghilangkan circle */}
        </select>
      </div>

      <div className="w-full h-screen">
        <MapContainer
          center={[0.526022, 101.454311]} // Koordinat Pekanbaru
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {geojsonData && (
            <>
              {/* GeoJSON layer */}
              <GeoJSON
                data={{
                  type: "FeatureCollection",
                  features: filteredFeatures,
                }}
                style={styleFeature}
                onEachFeature={(feature, layer) => {
                  // Tambahkan tooltip pada GeoJSON point
                  layer.bindTooltip(
                    `<strong>${feature.properties.Nama_Sekol}</strong><br>${feature.properties.Alamat}`,
                    { permanent: false, direction: "top" }
                  );
                }}
              />
              {/* Circle layer */}
              {renderCircles(filteredFeatures)}
            </>
          )}
        </MapContainer>
      </div>
    </UserLayout>
  );
};

export default Home;
