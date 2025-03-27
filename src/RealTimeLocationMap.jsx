import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { loadGoogleMapsScript } from './googleMapsLoader';
export default function RealTimeLocationMap({simulationStart}) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
 
  useEffect(() => {
    loadGoogleMapsScript(initializeMap);
  }, []);

  
  useEffect(() => {
    initializeMap();
  }, [simulationStart]);
  const initializeMap = () => {
    if (window.google) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 28.6139, lng: 77.2090 }, // Default to Delhi
        zoom: 12,
      });

      markerRef.current = new window.google.maps.Marker({
        position: { lat: 28.6139, lng: 77.2090 },
        map,
      });

      const updateLocation = async () => {
        console.log("simulation start value is : " + simulationStart);
        if(simulationStart == false){
            return;
        }
        try {
          const response = await fetch('http://localhost:8081/api/consumer/getLatestLocation'); // Replace with your API URL
          const data = await response.json();
          if (data.latitude && data.longitude) {
            const newPosition = { lat: data.latitude, lng: data.longitude };
            markerRef.current.setPosition(newPosition);
            map.setCenter(newPosition);
           
          }
        } catch (error) {
          console.error('Error fetching location data:', error);
        }
      };

      const intervalId = setInterval(updateLocation, 5000); // Fetch every 5 seconds
      return () => clearInterval(intervalId);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom align="center">
        Real-Time Location Tracking
      </Typography>
      <Box ref={mapRef} sx={{ height: '500px', width: '100%' }} />
    </Container>
  );
}
