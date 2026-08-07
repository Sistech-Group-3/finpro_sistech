"use client";

import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default Leaflet marker icon di Next.js
const markerIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface CrowdMapProps {
  latitude: number;
  longitude: number;

  onLocationSelect?: (
    latitude: number,
    longitude: number
  ) => void;
}

function MapController({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([latitude, longitude], 14, {
      duration: 1,
    });
  }, [latitude, longitude, map]);

  return null;
}

function MapClickHandler({
  onLocationSelect,
}: {
  onLocationSelect?: (
    latitude: number,
    longitude: number
  ) => void;
}) {
  useMapEvents({
    click(event) {
      onLocationSelect?.(
        event.latlng.lat,
        event.latlng.lng
      );
    },
  });

  return null;
}

export default function CrowdMap({
  latitude,
  longitude,
  onLocationSelect,
}: CrowdMapProps) {
  return (
    <div className="relative mt-4 overflow-hidden rounded-2xl border border-[#F4C9E4]">
      <MapContainer
        center={[latitude, longitude]}
        zoom={14}
        scrollWheelZoom={true}
        className="h-[340px] w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController
          latitude={latitude}
          longitude={longitude}
        />

        <MapClickHandler
          onLocationSelect={onLocationSelect}
        />

        <Marker
          position={[latitude, longitude]}
          icon={markerIcon}
        />
      </MapContainer>
    </div>
  );
}