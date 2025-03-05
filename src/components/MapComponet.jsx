import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header1';

const MapComponent = ({ onStateSelect }) => {
  const [hoveredState, setHoveredState] = useState(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const navigate = useNavigate();

  // Function to refresh the page once when redirected to this page
  const refreshOnRedirect = () => {
    const refreshed = sessionStorage.getItem('refreshed');
    if (!refreshed) {
      sessionStorage.setItem('refreshed', 'true');
      window.location.reload();
    }
  };

  const loadMapScript = () => {
    return new Promise((resolve, reject) => {
      const existingScript = document.querySelector('script[src="countrymap.js"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'countrymap.js';
        script.async = true;
        script.onload = () => {
          console.log('Map script loaded');
          resolve();
        };
        script.onerror = (error) => {
          console.error('Error loading map script:', error);
          reject(error);
        };
        document.body.appendChild(script);
      } else {
        if (window.simplemaps_countrymap) {
          console.log('Map script already loaded');
          resolve();
        } else {
          existingScript.onload = () => {
            console.log('Map script loaded');
            resolve();
          };
        }
      }
    });
  };

  const initializeMap = () => {
    if (window.simplemaps_countrymap && window.simplemaps_countrymap_mapdata) {
      const mapData = window.simplemaps_countrymap_mapdata;

      console.log('Initializing map...');
      window.simplemaps_countrymap.hooks.over_state = function (id) {
        const stateName = mapData.state_specific[id]?.name || 'Unknown State';
        setHoveredState(stateName);
      };

      window.simplemaps_countrymap.hooks.out_state = function () {
        setHoveredState(null);
      };

      window.simplemaps_countrymap.hooks.click_state = function (id) {
        try {
          const stateName = mapData.state_specific[id]?.name || 'Unknown State';
          if (typeof onStateSelect === 'function') {
            onStateSelect(stateName);
          }
          navigate(`/india?state=${encodeURIComponent(stateName)}`);
        } catch (error) {
          console.error('Error in state click handling:', error);
        }
      };

      if (!mapInitialized && window.simplemaps_countrymap.init) {
        console.log('Map initialization triggered');
        window.simplemaps_countrymap.init();
        setMapInitialized(true);
      }
    } else {
      console.error('Map object not found');
    }
  };

  useEffect(() => {
    refreshOnRedirect(); // Trigger page refresh when navigated to

    loadMapScript()
      .then(() => {
        const observer = new MutationObserver((mutations, obs) => {
          const mapDiv = document.getElementById('map');
          if (mapDiv) {
            initializeMap();
            obs.disconnect(); // Stop observing once initialized
          }
        });

        // Start observing the body for DOM changes
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      })
      .catch((error) => {
        console.error('Error initializing map:', error);
      });

    return () => {
      const script = document.querySelector('script[src="countrymap.js"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [navigate, onStateSelect, mapInitialized]);

  return (
    <>
      <Header />
      <div className="relative w-full bg-transparent h-screen max-w-screen-lg mx-auto px-4 py-4">
        <div id="map" className="w-full h-full"></div>
        {hoveredState && (
          <div className="absolute top-2 left-2 bg-white p-2 border border-gray-300 rounded shadow-md text-gray-800">
            {hoveredState}
          </div>
        )}
      </div>
    </>
  );
};

export default MapComponent;
