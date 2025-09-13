import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

interface MapPickerProps {
  zoom: number;
  style: React.CSSProperties;
  onChangeLocation: (lat: number, lng: number) => void;
  onChangeZoom: (zoom: number) => void;
  apiKey: string;
  defaultLocation: { lat: number; lng: number };
}

const MapPicker: React.FC<MapPickerProps> = ({
  zoom,
  style,
  onChangeLocation,
  onChangeZoom,
  apiKey,
  defaultLocation,
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState(defaultLocation);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setMarkerPosition({ lat, lng });
      onChangeLocation(lat, lng);
    }
  }, [onChangeLocation]);

  const handleZoomChanged = useCallback(() => {
    if (map) {
      const newZoom = map.getZoom();
      if (newZoom !== undefined) {
        onChangeZoom(newZoom);
      }
    }
  }, [map, onChangeZoom]);

  if (!isLoaded) {
    return <div style={style}>Loading...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={style}
      center={markerPosition}
      zoom={zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={handleMapClick}
      onZoomChanged={handleZoomChanged}
    >
      <Marker
        position={markerPosition}
        draggable={true}
        onDragEnd={(event) => {
          if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            setMarkerPosition({ lat, lng });
            onChangeLocation(lat, lng);
          }
        }}
      />
    </GoogleMap>
  );
};

export default MapPicker;
