import { LayersControl, LayerGroup, Circle, MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const Map = () => {
  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "500px" }}>
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="OpenStreetMap">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Mapbox">
          <TileLayer
            url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={YOUR_MAPBOX_TOKEN}"
            id="mapbox/streets-v11"
          />
        </LayersControl.BaseLayer>
        <LayersControl.Overlay name="Markers">
          <LayerGroup>
            <Marker position={[51.505, -0.09]}>
              <Popup>Marker 1</Popup>
            </Marker>
            <Circle center={[51.51, -0.1]} radius={200} />
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
};
export default Map;