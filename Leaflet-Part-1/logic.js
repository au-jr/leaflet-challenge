function buildData() {
  const url =
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

  d3.json(url).then((data) => {
    let quakeMarkers = [];

    data.features.map((each) => {
      var dataLongitude = each.geometry.coordinates[0];
      var dataLatitude = each.geometry.coordinates[1];
      var dataDepth = each.geometry.coordinates[2];
      var dataMagnitude = each.properties.mag;
      var dataEarthquakeId = each.id;
      var dataLocation = each.properties.place;

      function tsunamiQ() {
        query = each.properties.tsunami;
        return query == 0 ? "No" : "Yes";
      }

      var dataTime = new Date(each.properties.time);

      markerLayout = {
        radius: getMarkerSize(dataMagnitude),
        fillColor: getMarkerColor(dataDepth),
        stroke: true,
        color: "black",
        weight: 1,
        fillOpacity: 1,
      };

      let quakeMarker = L.circleMarker(
        [dataLatitude, dataLongitude],
        markerLayout
      ).bindPopup(
        `<h5>Earthquake ID : ` +
          dataEarthquakeId +
          `<br></br>` +
          `Coordinates : ` +
          dataLatitude.toPrecision(7) +
          `, ` +
          dataLongitude.toPrecision(7) +
          `<br></br>` +
          `Location hit : ` +
          dataLocation +
          `<br></br>` +
          `Time hit : ` +
          dataTime +
          `<br></br>` +
          `Magnitude : ` +
          dataMagnitude +
          `<br></br>` +
          `Depth of Earthquake : ` +
          dataDepth +
          `kms` +
          `<br></br>` +
          `Resulting Tsunami? ` +
          tsunamiQ() +
          `</h5>`
      );

      quakeMarkers.push(quakeMarker);
    });
    buildOverlay(L.layerGroup(quakeMarkers));
  });
}

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

function buildOverlay(earthquake) {
  let worldMapOverlay = L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );
  let baseMaps = {
    "World Map": worldMapOverlay,
  };

  let overlayMaps = {
    "Earthquake Marker": earthquake,
  };

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

  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend"),
      quakeDepth = [-10, 10, 30, 50, 70, 90],
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
