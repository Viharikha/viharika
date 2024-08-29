import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './Form.css';

const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, 
  } = useForm();

  const [location, setLocation] = useState({ lat: '', lng: '' });
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    const formData = {
      Emp_ID: data.employeeId,
      Emp_Name: data.name,
      Gender: data.gender,
      Address: data.address,  
      Latitude: location.lat,
      Longitude: location.lng,
      Phone_Number: data.phoneNumber,
      Emergency_Number: data.emergencyNumber,
    };
  
    console.log('Submitting Form Data:', formData);  
  
    try {
      const response = await axios.post('http://localhost:5098/employees', formData);
      console.log('Server response:', response.data);
      alert('Data submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error.response ? error.response.data : error.message);
      alert('Error submitting data. Check the console for details.');
    }
  };

  const handleAddressChange = async (e) => {
    const address = e.target.value;
    setValue('address', address); 

    if (address) {
      try {
        const apiKey = '880217507afd449d8f53e6cb43791930'; 
        const response = await axios.get(
          'https://api.opencagedata.com/geocode/v1/json',
          {
            params: {
              q: address,
              key: apiKey,
            },
          }
        );

        const { results } = response.data;

        if (results.length > 0) {
          const { geometry } = results[0];
          const newLocation = {
            lat: geometry.lat,
            lng: geometry.lng,
          };
          setLocation(newLocation);
          setValue('latitude', newLocation.lat); 
          setValue('longitude', newLocation.lng); 
        }
      } catch (error) {
        setError('Error fetching coordinates. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="employeeId">Employee ID</label>
        <input
          id="employeeId"
          {...register('employeeId', { required: 'Employee ID is required' })}
        />
        {errors.employeeId && <p>{errors.employeeId.message}</p>}
      </div>

      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && <p>{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="gender">Gender</label>
        <select
          id="gender"
          {...register('gender', { required: 'Gender is required' })}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        {errors.gender && <p>{errors.gender.message}</p>}
      </div>

      <div>
        <label htmlFor="address">Address</label>
        <input
          id="address"
          {...register('address', { required: 'Address is required' })}
          onChange={handleAddressChange} // Fetch coordinates when address changes
          placeholder="Enter address"
        />
        {errors.address && <p>{errors.address.message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      <div>
        <label htmlFor="latitude">Latitude</label>
        <input
          id="latitude"
          {...register('latitude')}
          value={location.lat} // Display latitude
          readOnly // Prevent manual input
        />
      </div>

      <div>
        <label htmlFor="longitude">Longitude</label>
        <input
          id="longitude"
          {...register('longitude')}
          value={location.lng} // Display longitude
          readOnly // Prevent manual input
        />
      </div>

      <div>
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          id="phoneNumber"
          {...register('phoneNumber', {
            required: 'Phone number is required',
            validate: validatePhoneNumber,
          })}
        />
        {errors.phoneNumber && <p>{errors.phoneNumber.message}</p>}
      </div>

      <div>
        <label htmlFor="emergencyNumber">Emergency Number</label>
        <input
          id="emergencyNumber"
          {...register('emergencyNumber', {
            required: 'Emergency number is required',
            validate: validateEmergencyNumber,
          })}
        />
        {errors.emergencyNumber && <p>{errors.emergencyNumber.message}</p>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

// Validation functions for phone numbers
const validatePhoneNumber = (value) => {
  if (!/^[0-9]{10}$/.test(value)) {
    return 'Phone number must be 10 digits';
  }
  return true;
};

const validateEmergencyNumber = (value) => {
  if (!/^[0-9]{10}$/.test(value)) {
    return 'Emergency number must be 10 digits';
  }
  return true;
};

export default Form;
