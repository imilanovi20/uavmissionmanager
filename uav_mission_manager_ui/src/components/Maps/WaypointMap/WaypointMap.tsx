import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { CreateWaypointDto } from '../../../types/waypoint.types';
import { MapContainer } from './WaypointMap.styles';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface WaypointMapProps {
  waypoints: CreateWaypointDto[];
  poiMarker?: { lat: number; lon: number } | null;
  selectedIndex: number | null;
  onWaypointClick: (index: number) => void;
  onMapClick: (lat: number, lon: number) => void;
  onWaypointDrag: (index: number, lat: number, lon: number) => void;
  centerLat: number;
  centerLon: number;
}

const WaypointMap = ({
  waypoints,
  poiMarker,
  selectedIndex,
  onWaypointClick,
  onMapClick,
  onWaypointDrag,
  centerLat,
  centerLon
}: WaypointMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const poiMarkerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current).setView([centerLat, centerLon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    map.on('click', (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update POI marker
  useEffect(() => {
    if (!mapRef.current) return;

    if (poiMarkerRef.current) {
      poiMarkerRef.current.remove();
      poiMarkerRef.current = null;
    }

    if (poiMarker) {
      const icon = L.divIcon({
        className: 'custom-poi-marker',
        html: `
          <div style="
            width: 32px;
            height: 32px;
            background: #dc2626;
            border: 3px solid white;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 3px 10px rgba(0,0,0,0.4);
          "></div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      poiMarkerRef.current = L.marker([poiMarker.lat, poiMarker.lon], {
        icon,
        draggable: false
      }).addTo(mapRef.current);
    }
  }, [poiMarker]);

  // Update waypoint markers
  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    const newMarkers = waypoints.map((wp, index) => {
      const isSelected = index === selectedIndex;
      
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            position: relative;
            width: 30px;
            height: 30px;
          ">
            <div style="
              width: 30px;
              height: 30px;
              background: ${isSelected ? '#2c2c2c' : '#3b82f6'};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 12px;
            ">
              ${index + 1}
            </div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      const marker = L.marker([wp.latitude, wp.longitude], {
        icon,
        draggable: true
      });

      marker.on('click', () => onWaypointClick(index));
      
      marker.on('dragend', (e) => {
        const pos = e.target.getLatLng();
        onWaypointDrag(index, pos.lat, pos.lng);
      });

      marker.addTo(mapRef.current!);
      
      return marker;
    });

    markersRef.current = newMarkers;

    if (waypoints.length > 1) {
      const latLngs = waypoints.map(wp => [wp.latitude, wp.longitude] as [number, number]);
      polylineRef.current = L.polyline(latLngs, {
        color: '#3b82f6',
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 10'
      }).addTo(mapRef.current);
    }

    if (waypoints.length > 0) {
      const bounds = L.latLngBounds(waypoints.map(wp => [wp.latitude, wp.longitude]));
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [waypoints, selectedIndex]);

  return <MapContainer ref={containerRef} />;
};

export default WaypointMap;
