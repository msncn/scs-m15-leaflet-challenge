// geojson
const link = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// GET request to the query URL
d3.json(link).then((data) => {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
    console.log(data.features);
});

function createFeatures(earthquakeData) {

    // Display place and time of each earthquake
    function onEachFeature(features, layer){
      layer.bindPopup(`<h3>${features.properties.mag}</h3> <h3>${(features.properties.place)}</h3><hr><p>${(features.properties.place)}</p>`);};
  
      // Create a GeoJSON layer that contains the features array on the earthquakeData object
      let earthquakes = L.geoJSON(earthquakeData, {
          onEachFeature: onEachFeature,
          // point to layer for the circule coordinates
          pointToLayer: function(features, coordinates) {
          let depth = features.properties.mag * 10;
          let geoMarkers = {
              radius: depth,
              fillColor: colors(depth),
              fillOpacity: 0.8,
              weight: 0.5
          };
          return L.circleMarker(coordinates, geoMarkers);
      }
      });
  
    // Sending earthquakes layer to the function
    createMap(earthquakes);
  };
  
  // Set colour
  function colors(depth) {
  
      // colour range
      let color = "";
  
      if (depth <= 10) {
          return color = "#66ffff";
      }
      else if (depth <= 20) {
          return color = "#66ff66";
      }
      else if (depth <= 30) {
          return color = "#b2ff66";
      }
      else if (depth <= 40) {
          return color = "#ffff66";
      }
      else if (depth <= 50) {
          return color = "#ffb266";
      }
      else {
          return color = "#ff6666";
      }
  
  };
  // function to create the map
  function createMap(earthquakes) {
      // Base layers.
      let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });
  
      // topographic view
      let topo = L.tileLayer.wms('http://ows.mundialis.de/services/service?',{layers: 'TOPO-WMS'});
  
      // BaseMaps object.
      let baseMaps = {
          "Street Map": street,
          "Topographic Map": topo,
      };
  
     // Overlay object.
      let overlayMaps = {
          Earthquakes: earthquakes
      };
  
      // Define a map object.
      let myMap = L.map("map", {
          center: [37.09, -95.71],
          zoom: 5,
          layers: [street, earthquakes]
      });
  
      // Add the layer control to the map.
      L.control.layers(baseMaps, overlayMaps).addTo(myMap);
      let info = L.control({
          position: "bottomright"
        });
        
        // When the layer control is added, insert a div with the class of "legend".
        info.onAdd = function() {
          let div = L.DomUtil.create("div", "legend");
          return div;
        };
        // Add the info legend to the map.
        info.addTo(map);
  };