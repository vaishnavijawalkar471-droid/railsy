"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polygon,
  Polyline,
  useMap,
  useMapEvents
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color = 'blue', size = 'medium') => {
  const sizes: Record<string, [number, number]> = {
    small: [20, 32],
    medium: [25, 41],
    large: [30, 50]
  };
  
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: sizes[size],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Map event handler component
const MapEvents = ({ onMapClick, onLocationFound }: any) => {
  const map = useMapEvents({
    click: (e) => {
      onMapClick && onMapClick(e.latlng);
    },
    locationfound: (e) => {
      onLocationFound && onLocationFound(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return null;
};

// Custom control component — uses stable refs to avoid stale closures
const CustomControls = ({ onLocate, onToggleLayer }: any) => {
  const map = useMap();
  // Store latest callbacks in refs so the DOM event handlers always call the latest version
  const onLocateRef = useRef(onLocate);
  const onToggleLayerRef = useRef(onToggleLayer);

  useEffect(() => { onLocateRef.current = onLocate; }, [onLocate]);
  useEffect(() => { onToggleLayerRef.current = onToggleLayer; }, [onToggleLayer]);

  useEffect(() => {
    const control = new L.Control({ position: 'topright' });

    control.onAdd = () => {
      const div = L.DomUtil.create('div', 'custom-controls');
      div.innerHTML = `
        <div style="background: rgba(15,23,42,0.92); padding: 8px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.4); display:flex; flex-direction:column; gap:4px; border:1px solid rgba(255,255,255,0.1);">
          <button id="satellite-btn" style="margin: 2px; padding: 7px 10px; border: 1px solid rgba(100,180,255,0.4); border-radius: 5px; cursor: pointer; color: #64b4ff; background:rgba(100,180,255,0.1); font-size:12px; white-space:nowrap;">🛰️ Satellite</button>
        </div>
      `;

      L.DomEvent.disableClickPropagation(div);
      L.DomEvent.disableScrollPropagation(div);

      const satelliteBtn = div.querySelector('#satellite-btn') as HTMLButtonElement;

      // Use refs so the handlers always call the latest callbacks
      if (satelliteBtn) {
        L.DomEvent.on(satelliteBtn, 'click', (e) => {
          L.DomEvent.stop(e);
          onToggleLayerRef.current?.('satellite');
          satelliteBtn.style.background = satelliteBtn.style.background.includes('0.3')
            ? 'rgba(100,180,255,0.1)'
            : 'rgba(100,180,255,0.3)';
        });
      }

      return div;
    };

    control.addTo(map);

    return () => {
      control.remove();
    };
    // Only re-create the control if the map instance changes (essentially never)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return null;
};

// Search component — uses a ref for the query value so the search handler is stable
const SearchControl = ({ onSearch }: any) => {
  const map = useMap();
  const queryRef = useRef('');
  const onSearchRef = useRef(onSearch);
  useEffect(() => { onSearchRef.current = onSearch; }, [onSearch]);

  useEffect(() => {
    const control = new L.Control({ position: 'topleft' });

    control.onAdd = () => {
      const div = L.DomUtil.create('div', 'search-control');
      div.innerHTML = `
        <div style="background: rgba(15,23,42,0.92); padding: 8px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.4); display: flex; gap: 6px; border:1px solid rgba(255,255,255,0.1);">
          <input 
            id="search-input" 
            type="text" 
            placeholder="Search places..." 
            style="padding: 7px 10px; border: 1px solid rgba(255,153,51,0.3); border-radius: 5px; width: 200px; color: white; background: rgba(255,255,255,0.05); font-size:13px; outline:none;"
          />
          <button 
            id="search-btn" 
            style="padding: 7px 12px; border: 1px solid rgba(255,153,51,0.4); border-radius: 5px; cursor: pointer; background: rgba(255,153,51,0.2); color: #FF9933; font-size:14px;"
          >
            🔍
          </button>
        </div>
      `;

      L.DomEvent.disableClickPropagation(div);
      L.DomEvent.disableScrollPropagation(div);

      const input = div.querySelector('#search-input') as HTMLInputElement;
      const button = div.querySelector('#search-btn') as HTMLButtonElement;

      const doSearch = async () => {
        const q = queryRef.current.trim();
        if (!q) return;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`
          );
          const results = await response.json();
          if (results.length > 0) {
            const { lat, lon, display_name } = results[0];
            const latLng = [parseFloat(lat), parseFloat(lon)] as [number, number];
            map.flyTo(latLng, 13);
            onSearchRef.current?.({ latLng, name: display_name });
          }
        } catch (error) {
          console.error('Search error:', error);
        }
      };

      if (input) {
        L.DomEvent.on(input, 'input', (e: any) => { queryRef.current = e.target.value; });
        L.DomEvent.on(input, 'keydown', (e: any) => {
          if (e.key === 'Enter') { L.DomEvent.stop(e); doSearch(); }
        });
      }
      if (button) {
        L.DomEvent.on(button, 'click', (e) => { L.DomEvent.stop(e); doSearch(); });
      }

      return div;
    };

    control.addTo(map);

    return () => {
      control.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return null;
};

// Main AdvancedMap component
export const AdvancedMap = ({
  center = [51.505, -0.09] as [number, number],
  zoom = 13,
  markers = [],
  polygons = [],
  circles = [],
  polylines = [],
  onMarkerClick,
  onMapClick,
  enableClustering = true,
  enableSearch = true,
  enableControls = true,
  enableDrawing = false,
  mapLayers = {
    openstreetmap: true,
    satellite: false,
    traffic: false
  },
  className = '',
  style = { height: '500px', width: '100%' }
}: any) => {
  const [currentLayers, setCurrentLayers] = useState(mapLayers);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [clickedLocation, setClickedLocation] = useState<any>(null);

  // Handle layer toggling — stable with useCallback
  const handleToggleLayer = useCallback((layerType: string) => {
    setCurrentLayers((prev: any) => ({
      ...prev,
      [layerType]: !prev[layerType]
    }));
  }, []);

  // Handle geolocation — stable with useCallback
  const handleLocate = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  }, []);

  // Handle map click — stable with useCallback
  const handleMapClick = useCallback((latlng: any) => {
    setClickedLocation(latlng);
    onMapClick && onMapClick(latlng);
  }, [onMapClick]);

  // Handle search results
  const handleSearch = useCallback((result: any) => {
    setSearchResult(result);
  }, []);

  return (
    <div className={`advanced-map ${className}`} style={style}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        scrollWheelZoom={true}
      >
        {/* Base tile layers */}
        {currentLayers.openstreetmap && (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        )}
        
        {currentLayers.satellite && (
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        )}

        {/* Map events */}
        <MapEvents
          onMapClick={handleMapClick}
          onLocationFound={setUserLocation}
        />

        {/* Search control */}
        {enableSearch && <SearchControl onSearch={handleSearch} />}

        {/* Custom controls */}
        {enableControls && (
          <CustomControls
            onLocate={handleLocate}
            onToggleLayer={handleToggleLayer}
          />
        )}

        {/* Markers with clustering */}
        {enableClustering ? (
          <MarkerClusterGroup>
            {markers.map((marker: any, index: number) => (
              <Marker
                key={marker.id || index}
                position={marker.position}
                icon={marker.icon || createCustomIcon(marker.color, marker.size)}
                eventHandlers={{
                  click: () => onMarkerClick && onMarkerClick(marker)
                }}
              >
                {marker.popup && (
                  <Popup>
                    <div>
                      <h3>{marker.popup.title}</h3>
                      <p>{marker.popup.content}</p>
                      {marker.popup.image && (
                        <img 
                          src={marker.popup.image} 
                          alt={marker.popup.title}
                          style={{ maxWidth: '200px', height: 'auto' }}
                        />
                      )}
                    </div>
                  </Popup>
                )}
              </Marker>
            ))}
          </MarkerClusterGroup>
        ) : (
          markers.map((marker: any, index: number) => (
            <Marker
              key={marker.id || index}
              position={marker.position}
              icon={marker.icon || createCustomIcon(marker.color, marker.size)}
              eventHandlers={{
                click: () => onMarkerClick && onMarkerClick(marker)
              }}
            >
              {marker.popup && (
                <Popup>
                  <div>
                    <h3>{marker.popup.title}</h3>
                    <p>{marker.popup.content}</p>
                  </div>
                </Popup>
              )}
            </Marker>
          ))
        )}

        {/* User location marker */}
        {userLocation && (
          <Marker 
            position={userLocation}
            icon={createCustomIcon('red', 'medium')}
          >
            <Popup>Your current location</Popup>
          </Marker>
        )}

        {/* Search result marker */}
        {searchResult && (
          <Marker 
            position={searchResult.latLng}
            icon={createCustomIcon('green', 'large')}
          >
            <Popup>{searchResult.name}</Popup>
          </Marker>
        )}

        {/* Clicked location marker */}
        {clickedLocation && (
          <Marker 
            position={[clickedLocation.lat, clickedLocation.lng]}
            icon={createCustomIcon('orange', 'small')}
          >
            <Popup>
              Lat: {clickedLocation.lat.toFixed(6)}<br/>
              Lng: {clickedLocation.lng.toFixed(6)}
            </Popup>
          </Marker>
        )}

        {/* Polygons */}
        {polygons.map((polygon: any, index: number) => (
          <Polygon
            key={polygon.id || index}
            positions={polygon.positions}
            pathOptions={polygon.style || { color: 'purple', weight: 2, fillOpacity: 0.3 }}
          >
            {polygon.popup && <Popup>{polygon.popup}</Popup>}
          </Polygon>
        ))}

        {/* Circles */}
        {circles.map((circle: any, index: number) => (
          <Circle
            key={circle.id || index}
            center={circle.center}
            radius={circle.radius}
            pathOptions={circle.style || { color: 'blue', weight: 2, fillOpacity: 0.2 }}
          >
            {circle.popup && <Popup>{circle.popup}</Popup>}
          </Circle>
        ))}

        {/* Polylines */}
        {polylines.map((polyline: any, index: number) => (
          <Polyline
            key={polyline.id || index}
            positions={polyline.positions}
            pathOptions={polyline.style || { color: 'red', weight: 3 }}
          >
            {polyline.popup && <Popup>{polyline.popup}</Popup>}
          </Polyline>
        ))}
      </MapContainer>
    </div>
  );
};
