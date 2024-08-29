import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import './Mappicker.css';

const Mappicker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState([51.505, -0.09]); // Default position
  const [searchQuery, setSearchQuery] = useState('');

  const handleMapClick = (event) => {
    const { lat, lng } = event.latlng;
    setPosition([lat, lng]);
    onLocationSelect({ lat, lng });
  };

  const handleSearch = async () => {
    if (searchQuery) {
      try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
          params: {
            q: searchQuery,
            format: 'json',
            limit: 1
          }
        });

        const [result] = response.data;
        if (result) {
          const { lat, lon } = result;
          const newPosition = [parseFloat(lat), parseFloat(lon)];
          setPosition(newPosition);
          onLocationSelect({ lat: newPosition[0], lng: newPosition[1] });
        } else {
          alert('Location not found');
        }
      } catch (error) {
        console.error('Error fetching location data:', error);
        alert('Error fetching location data');
      }
    }
  };

  const MapEvents = () => {
    const map = useMap();

    useEffect(() => {
      if (map) {
        map.zoomControl.remove(); // Remove zoom control
      }
    }, [map]);

    useEffect(() => {
      if (map) {
        map.on('click', handleMapClick); // Set up map click event
        return () => map.off('click', handleMapClick); // Clean up map click event
      }
    }, [map]);

    return null;
  };

  return (
    <div className="map-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEvents />
        <Marker position={position}>
          <Popup>
            Selected Location: Latitude {position[0]}, Longitude {position[1]}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Mappicker;