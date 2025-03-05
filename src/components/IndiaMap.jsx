import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useNavigate, useLocation } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import heritageData from "./heritageData.json";
import Header1 from "./Header1";

const customIcon = new L.Icon({
  iconUrl: "https://static.vecteezy.com/system/resources/previews/017/178/337/original/location-map-marker-icon-symbol-on-transparent-background-free-png.png",
  iconSize: [30, 30],
});

const MapComponent = ({ selectedSites }) => {
  const map = useMap();
  const [routeControl, setRouteControl] = useState(null);

  useEffect(() => {
    // Function to create route control
    const createRouteControl = () => {
      const waypoints = selectedSites.map((site) =>
        L.latLng(site.coordinates.latitude, site.coordinates.longitude)
      
      );

      return L.Routing.control({
        waypoints,
        routeWhileDragging: true,
        lineOptions: { styles: [{ color: "#6FA1EC", weight: 5 }] },
        createMarker: (i, wp) => L.marker(wp.latLng, { icon: customIcon }),
        show: false, // Hides the turn-by-turn instructions
        addWaypoints: false, // Prevents adding waypoints by interacting with the map
        draggableWaypoints: false, // Prevents dragging waypoints
      }).addTo(map);
    };

    // Clean up previous route control if it exists
    if (routeControl) {
      map.removeControl(routeControl);
      setRouteControl(null);  // Reset routeControl to avoid stale state
    }

    // Only add a new route if there are more than 1 site
    if (selectedSites.length > 1) {
      const control = createRouteControl();
      setRouteControl(control);
    }

    // Cleanup on component unmount or when `selectedSites` changes
    return () => {
      if (routeControl) {
        map.removeControl(routeControl);
      }
    };
  }, [selectedSites, map]);  // Remove routeControl dependency to avoid extra rerenders

  return null;
};

const IndiaMap = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState(null);
  const [selectedSites, setSelectedSites] = useState([]);
  const [siteToAdd, setSiteToAdd] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const stateFromQuery = query.get("state");
    if (stateFromQuery) {
      setSelectedState(stateFromQuery);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching location", error);
        }
      );
    }
  }, [location.search]);

  const handleSiteClick = (site) => {
    navigate(`/monument/${site.name}`, { state: { site } });
  };

  const handleSiteAdd = () => {
    const site = heritageData[selectedState]?.find((s) => s.name === siteToAdd);
    if (site && !selectedSites.some((s) => s.name === site.name)) {
      setSelectedSites((prevSites) => [...prevSites, site]);
    }
  };

  const handleRemoveSite = (siteName) => {
    setSelectedSites((prevSites) =>
      prevSites.filter((site) => site.name !== siteName)
    );
  };

  const handleOpenNavigation = () => {
    if (!userLocation) {
      alert("Unable to get your location. Please enable location services.");
      return;
    }

    const waypoints = selectedSites
      .map(
        (site) =>
          `${site.coordinates.latitude},${site.coordinates.longitude}`
      )
      .join("/");

    const googleMapsUrl = `https://www.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${waypoints}`;

    window.open(googleMapsUrl, "_blank");
  };

  const CenterMapOnState = ({ state }) => {
    const map = useMap();
    useEffect(() => {
      if (map && heritageData[state]) {
        const bounds = L.latLngBounds(
          heritageData[state].map((site) => [
            site.coordinates.latitude,
            site.coordinates.longitude,
          ])
        );
        map.fitBounds(bounds);
        map.setMaxBounds(bounds); // Set the state-specific bounds
        map.setMinZoom(map.getZoom()); // Lock zoom level to prevent zooming out
      }
    }, [map, state]);
    return null;
  };

  return (
    <>
      <Header1 />
      <div className="flex h-screen">
       <div className="w-1/4 p-4 bg-gray-100 overflow-y-auto h-full">
          <div>
            <h2 className="text-xl font-bold mb-2">Add Sites to Route</h2>
            <label className="block mb-2">
              Select Site:
              <select
                value={siteToAdd}
                onChange={(e) => setSiteToAdd(e.target.value)}
                className="w-full mt-1 p-2 bg-white border rounded"
              >
                <option value="">Select Site</option>
                {heritageData[selectedState]?.map((site) => (
                  <option key={site.name} value={site.name}>
                    {site.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              onClick={handleSiteAdd}
              className="bg-blue-500 text-white py-2 px-4 w-full rounded mt-2"
            >
              Add Site
            </button>
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">Selected Sites for Route:</h2>
            <ul className="mb-4">
              {selectedSites.map((site) => (
                <li key={site.name} className="mb-2 flex justify-between">
                  {site.name}
                  <button
                    onClick={() => handleRemoveSite(site.name)}
                    className="bg-red-500 text-white py-1 px-2 rounded"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            {selectedSites.length > 1 && (
              <div>
                <button
                  onClick={handleOpenNavigation}
                  className="bg-green-500 text-white py-2 px-4 rounded mb-2"
                >
                  Open Navigation
                </button>
                <p className="text-sm text-gray-600">
                  This will open the route in Google Maps.
                </p>
              </div>
            )}
          </div>

          <h2 className="text-xl font-bold mb-4">Heritage Sites</h2>
          <label className="block mb-4">
            Select State:
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full mt-1 p-2 bg-white border rounded"
            >
              {Object.keys(heritageData).map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </label>

          <div className="mb-8">
            {heritageData[selectedState]?.map((site) => (
              <div
                key={site.name}
                className="mb-4 p-4 bg-white rounded-lg shadow cursor-pointer"
                onClick={() => handleSiteClick(site)}
              >
                <img
                  src={site.image_url}
                  alt={site.name}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
                <h3 className="text-lg font-semibold">{site.name}</h3>
                <p className="text-sm text-gray-600">{site.detailed_description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-3/4">
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            minZoom={5}
            maxZoom={15}
            zoomControl={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            touchZoom={false}
            style={{ height: "100vh", width: "100%" }}
          >
           
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            />
             <button className="bg-black">
              hello
            </button>
            {heritageData[selectedState]?.map((site) => (
              <Marker
                key={site.name}
                position={[
                  site.coordinates.latitude,
                  site.coordinates.longitude,
                ]}
                icon={customIcon}
              >
                <Popup>
                  <div className="cursor-pointer" onClick={() => handleSiteClick(site)}>
                    <img src={site.image_url} alt={site.name} />
                    <h3 className="text-lg font-semibold">{site.name}</h3>
                    <p className="text-sm text-gray-600">{site.detailed_description}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            <CenterMapOnState state={selectedState} />
            {selectedSites.length > 1 && <MapComponent selectedSites={selectedSites} />}
          </MapContainer>
        </div>
      </div>
    </>
  );
};

export default IndiaMap;
