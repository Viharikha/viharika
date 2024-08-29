import React, { useState } from 'react';
import { GoogleMap, Marker, LoadScript, Autocomplete, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import axios from 'axios';

// Default location
const defaultPosition = { lat: 40.7128, lng: -74.0060 };

const EmpRegister = () => {
  const [position, setPosition] = useState(defaultPosition);
  const [empID, setEmpID] = useState('');
  const [empName, setEmpName] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emergencyNumber, setEmergencyNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      Emp_ID: empID,
      Emp_Name: empName,
      Gender: gender,
      Latitude: position.lat,
      Longitude: position.lng,
      Phone_Number: phoneNumber,
      Emergency_Number: emergencyNumber
    });
  };

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: searchTerm,
          key: 'YOUR_GOOGLE_MAPS_API_KEY' // Replace with your API key
        }
      });

      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry.location;
        setPosition({ lat, lng });
      } else {
        setError('Location not found');
      }
    } catch (err) {
      setError('Error fetching location');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Employee Registration</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Employee ID:
            <input
              type="text"
              value={empID}
              onChange={(e) => setEmpID(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Name:
            <input
              type="text"
              value={empName}
              onChange={(e) => setEmpName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Gender:
            <input
              type="text"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Phone Number:
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Emergency Number:
            <input
              type="text"
              value={emergencyNumber}
              onChange={(e) => setEmergencyNumber(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <h3>Location</h3>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter an address"
          />
          <button type="button" onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
          {error && <p>{error}</p>}
          <div style={{ height: '400px', width: '100%' }}>
            <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
              <GoogleMap
                mapContainerStyle={{ height: '100%', width: '100%' }}
                center={position}
                zoom={13}
              >
                <Marker position={position} />
              </GoogleMap>
            </LoadScript>
          </div>
          <p>Latitude: {position.lat}</p>
          <p>Longitude: {position.lng}</p>
        </div>
        <button type="submit">Register Employee</button>
      </form>
    </div>
  );
};

export default EmpRegister;
