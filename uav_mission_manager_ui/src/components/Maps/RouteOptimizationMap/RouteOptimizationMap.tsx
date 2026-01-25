import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer } from './RouteOptimizationMap.styles';
import type { ObstacleDto, RouteOptimizationResultDto } from '../../../types/pathPlanning.types';

interface RouteOptimizationMapProps {
  waypoints: any[];
  obstacles: (ObstacleDto & { originalIndex: number })[];
  optimalRoute: RouteOptimizationResultDto | null;
}

const RouteOptimizationMap = ({
  waypoints,
  obstacles,
  optimalRoute
}: RouteOptimizationMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const waypointsLayerRef = useRef<L.LayerGroup | null>(null);
  const obstaclesLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const centerLat = waypoints[0]?.latitude || 45.8;
    const centerLon = waypoints[0]?.longitude || 16.0;

    const map = L.map(containerRef.current).setView([centerLat, centerLon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    waypointsLayerRef.current = L.layerGroup().addTo(map);
    obstaclesLayerRef.current = L.layerGroup().addTo(map);
    routeLayerRef.current = L.layerGroup().addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update waypoints
  useEffect(() => {
    if (!mapRef.current || !waypointsLayerRef.current) return;

    waypointsLayerRef.current.clearLayers();

    waypoints.forEach((wp, index) => {
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: 30px;
            height: 30px;
            background: #3b82f6;
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
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      L.marker([wp.latitude, wp.longitude], { icon }).addTo(waypointsLayerRef.current!);
    });

    if (waypoints.length > 0) {
      const bounds = L.latLngBounds(waypoints.map(wp => [wp.latitude, wp.longitude]));
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [waypoints]);

  // Update obstacles
  useEffect(() => {
    if (!mapRef.current || !obstaclesLayerRef.current) return;

    obstaclesLayerRef.current.clearLayers();

    obstacles.forEach(obstacle => {
      if (obstacle.coordinates && obstacle.coordinates.length > 0) {
        // Draw polygon for multi-point obstacles
        const latLngs = obstacle.coordinates.map(coord => [coord.lat, coord.lng] as [number, number]);
        
        L.polygon(latLngs, {
          color: '#dc2626',
          fillColor: '#fee2e2',
          fillOpacity: 0.4,
          weight: 2
        })
        .bindPopup(`
          <div style="font-size: 0.875rem;">
            <strong>${obstacle.name}</strong><br/>
            Type: ${obstacle.type}<br/>
            Points: ${obstacle.coordinates.length}
          </div>
        `)
        .addTo(obstaclesLayerRef.current!);

        // Draw buffer if exists
        if (obstacle.bufferCoordinates && obstacle.bufferCoordinates.length > 0) {
          const bufferLatLngs = obstacle.bufferCoordinates.map(
            coord => [coord.lat, coord.lng] as [number, number]
          );
          
          L.polygon(bufferLatLngs, {
            color: '#f97316',
            fillColor: '#fed7aa',
            fillOpacity: 0.2,
            weight: 1,
            dashArray: '5, 5'
          })
          .bindPopup(`
            <div style="font-size: 0.875rem;">
              <strong>${obstacle.name} (Buffer Zone)</strong>
            </div>
          `)
          .addTo(obstaclesLayerRef.current!);
        }
      }
    });
  }, [obstacles]);

  // Update optimal route
  useEffect(() => {
    if (!mapRef.current || !routeLayerRef.current) return;

    routeLayerRef.current.clearLayers();

    if (optimalRoute && optimalRoute.optimizedRoute && optimalRoute.optimizedRoute.length > 0) {
      // Draw optimal route
      const routeLatLngs = optimalRoute.optimizedRoute
        .sort((a, b) => a.order - b.order)
        .map(point => [point.lat, point.lng] as [number, number]);

      L.polyline(routeLatLngs, {
        color: '#10b981',
        weight: 4,
        opacity: 0.8
      }).addTo(routeLayerRef.current!);

      // Add direction arrows every few points
      const arrowStep = Math.max(1, Math.floor(routeLatLngs.length / 8));
      for (let i = 0; i < routeLatLngs.length - 1; i += arrowStep) {
        const start = routeLatLngs[i];
        const end = routeLatLngs[i + 1];
        
        // Calculate angle for arrow direction
        const angle = Math.atan2(end[0] - start[0], end[1] - start[1]) * (180 / Math.PI);
        
        L.marker(start, {
          icon: L.divIcon({
            className: 'route-arrow',
            html: `
              <div style="
                font-size: 16px;
                color: #10b981;
                transform: rotate(${angle}deg);
              ">➤</div>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          })
        }).addTo(routeLayerRef.current!);
      }
    }
  }, [optimalRoute]);

  return <MapContainer ref={containerRef} />;
};

export default RouteOptimizationMap;
