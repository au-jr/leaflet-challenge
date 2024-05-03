// Create a function to access the api and parse relevant data out
function buildData() {
  const url =
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

    // Access the url using the d3 library. Perform a function on the return geojson data.
  d3.json(url).then((data) => {

    // Create an empty array to hold the marker information.
    let quakeMarkers = [];
    
    // loop through or map the return data.features geojson data to retrieve information for each earthquake marker.
    data.features.map((each) => {
      var dataLongitude = each.geometry.coordinates[0];
      var dataLatitude = each.geometry.coordinates[1];
      var dataDepth = each.geometry.coordinates[2];
      var dataMagnitude = each.properties.mag;
      var dataEarthquakeId = each.id;
      var dataLocation = each.properties.place;
      
      // To add some more information to the popup we'll create a function to return No or Yes if there was a resulting tsunami.
      function tsunamiQ() {
        query = each.properties.tsunami;
        // Using ternary operator, check if condition is truthy, in ths case query is 0, return No, else return yes.
        return query == 0 ? "No" : "Yes";
      }

      // Convert time output returned as UTC to person readable time.
      var dataTime = new Date(each.properties.time);
      
      // Create marker layout
      markerLayout = {
        // Call on the getMarkerSize function defined later to get the radius based on magnitude
        radius: getMarkerSize(dataMagnitude),
        // Call on the getMarkerColor function defined later to get the colour based on depth
        fillColor: getMarkerColor(dataDepth),
        // The outline of the marker
        stroke: true,
        // The colour of the outline
        color: "black",
        // The width of the outline
        weight: 1,
        // The fill opacity, 1 being not at all.
        fillOpacity: 1,
      };
      
      // Declare a quakeMarker variable to hold the marker information. Call the L.circleMarker function from leaflet library. Pass the longitude, latitude and markerlayout.
      let quakeMarker = L.circleMarker(
        [dataLatitude, dataLongitude],
        markerLayout
        // Add a popup on click
      ).bindPopup(
        // format text as paragraph element <p></p> and bold <b></b>
        `<p><b>Earthquake ID: </b>` +
          dataEarthquakeId +
          `<br></br>` +
          `<b>Coordinates: </b>` +
          // Rounded to 7 digits for better presentation
          dataLatitude.toPrecision(7) +
          `, ` +
          dataLongitude.toPrecision(7) +
          `<br></br>` +
          `<b>Location hit: </b>` +
          dataLocation +
          `<br></br>` +
          `<b>Time hit: </b>` +
          dataTime +
          `<br></br>` +
          `<b>Magnitude: </b>` +
          dataMagnitude +
          `<br></br>` +
          `<b>Depth of Earthquake: </b>` +
          dataDepth +
          `kms` +
          `<br></br>` +
          `<b>Resulting Tsunami? </b>` +
          // Call the tsunamiQ function to return the text output
          tsunamiQ() +
          `</p>`
      );
      
      // Push the quakeMarker information to the quakeMarkers array
      quakeMarkers.push(quakeMarker);
    });
    // Call the buildOverlay function passing in the quakeMarkers array as the function argument.
    buildOverlay(L.layerGroup(quakeMarkers));
  });
}

// Build marker size function by passing an argument and checking against conditions.
// Used ternary conditional notation to check if argument greater or equal to 8.2 returns true, return 25, else etc etc. to assign different marker sizes.
function getMarkerSize(d) {
  return d >= 8.2
    ? 25
    : d >= 7.2
    ? 22
    : d >= 6.2
    ? 19
    : d >= 5.5
    ? 16
    : d >= 4.5
    ? 13
    : d >= 3.5
    ? 10
    : d >= 2.5
    ? 8
    : d >= 1.5
    ? 6
    : 4;
}

// Build a marker colour function to pass an argument to check against conditions.
// Use ternary conditionaal notation to assess if argument is equal or greater than 90, else etc etc to return marker colours as a hex-colour string.
function getMarkerColor(d) {
  return d >= 90
    ? "#25064c"
    : d >= 70
    ? "#00506f"
    : d >= 50
    ? "#53856f"
    : d >= 30
    ? "#879978"
    : d >= 10
    ? "#d3c4b6"
    : "#ebe0dd";
}

// Build a buildOverlay function which accepts an argument and builds the map based on the argument passed.
function buildOverlay(earthquake) {

  // Define the world map overlay from the leaflet tileLayer function.
  let worldMapOverlay = L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );

  // Define the variable baseMap with the worldmap overlay as the base as an object.
  let baseMaps = {
    "World Map": worldMapOverlay,
  };

  // Define the variable overlayMaps as an object
  let overlayMaps = {
    "Earthquake Marker": earthquake,
  };

  // Create the map object with the leafler L.map function. Pass through the above layers as overlays. Centre the map on lon/lat coordinates 0,0 with a zoom level of 2.
  let map = L.map("map", {
    center: [0, 0],
    zoom: 2,
    layers: [worldMapOverlay, earthquake],
  });

  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control
    .layers(baseMaps, overlayMaps, {
      collapsed: false,
    })
    .addTo(map);
  
    // Create a legend and specify the position of the control element.
  var legend = L.control({ position: "bottomright" });
  
  // Using the onAdd command to run the function when the .addTo command is used to add the legend.
  legend.onAdd = function (map) {
    // Calls on the leaflet DomUtil.create command to take in 2 arguments adn creates a HTML element with div, sets its class to info-legend
    var div = L.DomUtil.create("div", "info legend"),
      // Create an array that matches the same conditions as getMarkerColor, plus an additional -10 element which represents the maximum (km above sea level) elevation an earthquake has been measured in the data.
      quakeDepth = [-10, 10, 30, 50, 70, 90],
      // Initial text in the info legend element. Bolded using <strong>
      labels = [`<strong>Depth of Earthquake (kms)</strong>`],
      from,
      to;

    // loop through our density intervals and generate a label with a colored square for each interval

    for (var i = 0; i < quakeDepth.length; i++) {
      from = quakeDepth[i];
      to = quakeDepth[i + 1];

      labels.push(
        '<i style="background:' +
          getMarkerColor(from + 1) +
          '"></i> ' +
          from +
          (to ? "&ndash;" + to : "+")
      );
    }
    div.innerHTML = labels.join("<br>");
    return div;
  };

  legend.addTo(map);
}

buildData();