// Set the API endpoint URL
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create the Leaflet map
var myMap = L.map("map").setView([37.09, -95.71], 5);

// Add the OpenStreetMap tile layer to the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(myMap);

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
  // Define the map style function
  function mapStyle(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#0D2E24",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5,
    };
  }

  // Define the marker radius function
  function getRadius(magnitude) {
    return magnitude * 4;
  }

  // Define the marker color function based on depth
  function getColor(depth) {
    return depth > 90
      ? "#FF5F65"
      : depth > 70
      ? "#FCA35D"
      : depth > 50
      ? "#FDB72A"
      : depth > 30
      ? "#F7DB11"
      : depth > 10
      ? "#DCF400"
      : "#A3F600";
  }

  // Add earthquake data to the map as circle markers
  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: mapStyle,
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        `<b>Magnitude:</b> ${feature.properties.mag}<br>` +
        `<b>Depth:</b> ${feature.geometry.coordinates[2]}<br>` +
        `<b>Location:</b> ${feature.properties.place}<br>`
      );
    },
  }).addTo(myMap);

  // Create a legend control
  var legend = L.control({ position: "bottomright" });

  // Add the legend to the map
  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "legend");
    var grades = [0, 10, 30, 50, 70, 90];
    var labels = [];

    for (var i = 0; i < grades.length; i++) {
      labels.push(
        '<i style="background:' +
          getColor(grades[i] + 1) +
          '"></i> ' +
          grades[i] +
          (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+")
      );
    }

    div.innerHTML = labels.join(" ");
    return div;
  };

  legend.addTo(myMap);
});