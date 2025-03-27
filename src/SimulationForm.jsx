import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { loadGoogleMapsScript } from './googleMapsLoader';
export default function SimulationForm({ setSimulationStart }) {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [startCoordinates, setStartCoordinates] = useState(null);
  const [endCoordinates, setEndCoordinates] = useState(null);
  const startInputRef = useRef(null);
  const endInputRef = useRef(null);

  useEffect(() => {
    loadGoogleMapsScript(initializeAutocomplete);
  }, []);

  const initializeAutocomplete = () => {
    if (window.google) {
      const startAutocomplete = new window.google.maps.places.Autocomplete(startInputRef.current);
      const endAutocomplete = new window.google.maps.places.Autocomplete(endInputRef.current);

      startAutocomplete.addListener('place_changed', () => {
        const place = startAutocomplete.getPlace();
        setStartLocation(place.formatted_address || '');
        if (place.geometry) {
          setStartCoordinates({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
        }
      });

      endAutocomplete.addListener('place_changed', () => {
        const place = endAutocomplete.getPlace();
        setEndLocation(place.formatted_address || '');
        if (place.geometry) {
          setEndCoordinates({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
        }
      });
    }
  };

  const handleStartSimulation = async () => {
    console.log('Start Location:', startLocation, 'Coordinates:', startCoordinates);
    console.log('End Location:', endLocation, 'Coordinates:', endCoordinates);
    setSimulationStart(true);
    alert('Simulation Started!');

    if (startCoordinates && endCoordinates) {
      const requestBody = {
        id: '10',
        startLongitude: startCoordinates.lng,
        startLatitude: startCoordinates.lat,
        endLongitude: endCoordinates.lng,
        endLatitude: endCoordinates.lat
      };

      try {
        const response = await fetch('http://localhost:8080/api/location/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        if (response.ok) {
          console.log('API call successful');
        } else {
          console.error('API call failed');
        }
      } catch (error) {
        console.error('Error calling API:', error);
      }
    } else {
      console.error('Start or end coordinates are missing');
    }
  };

  const handleStopSimulation = () => {
    setSimulationStart(false);
    window.location.reload();
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom align="center">
        Location Simulation
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Start Location"
          variant="outlined"
          fullWidth
          inputRef={startInputRef}
          value={startLocation}
          onChange={(e) => setStartLocation(e.target.value)}
        />
        <TextField
          label="End Location"
          variant="outlined"
          fullWidth
          inputRef={endInputRef}
          value={endLocation}
          onChange={(e) => setEndLocation(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleStartSimulation}>
          Start Simulation
        </Button>
        <Button variant="contained" color="error" onClick={handleStopSimulation}>
          Stop Simulation
        </Button>
      </Box>
    </Container>
  );
}
