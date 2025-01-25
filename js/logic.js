// Create the 'basemap' tile layer that will be the background of our map.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

  

// Create the map object with center and zoom options.
let myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
  layers: [street]
});

// Then add the 'basemap' tile layer to the map.
let baseMaps = {
  "Street Map": street,
  //X"Topographic Map": topo
};



// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // This function returns the style data for each of the earthquakes we plot on
  // the map. Pass the magnitude and depth of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "black",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // This function determines the color of the marker based on the depth of the earthquake.
  function getColor(depth) {
    if (depth > 90){
      return "#ff5f65";
    }
    else if (depth > 70){
      return "#fba35d";
    }
    else if (depth > 50){
      return "#fdb72a";
    }
    else if (depth > 30){
      return "#f6db11";
    }
    else if (depth > 10){
      return "#dcf401";
    }
    else {
      return "#a3f600";
    }
  }

  
  // This function determines the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {
  return magnitude * 5;
  }

  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {

    // Turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },

    // Set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    
    // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {
            layer.bindPopup("<b>Magnitude: </b>" + feature.properties.mag + "<br><b>Dept: </b>" +feature.geometry.coordinates[2]+ "<br><b>Location: </b>" + feature.properties.place);

    }
  // OPTIONAL: Step 2
  // Add the data to the earthquake layer instead of directly to the map.
  }).addTo(myMap);

  // Create a legend control object.
  let legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");

  
    // Initialize depth intervals and colors for the legend
    let depth = [-10, 10, 30, 50, 70, 90];
    let colors = ['#a3f600','#dcf401','#f6db11','#fdb72a','#fba35d','#ff5f65']

    // Loop through our depth intervals to generate a label with a colored square for each interval.
    for (let i = 0; i < depth.length; i++) {
      div.innerHTML += 
    "<i style='background: " + colors[i] + " '></i>" + 
    depth[i];
  
    if (depth[i + 1]) {
      div.innerHTML += "&ndash;" + depth[i + 1] + "<br>";
    } else {
      div.innerHTML += "+";
    }
    }
    return div;
  };


  // Finally, add the legend to the map.

  legend.addTo(myMap)

});
