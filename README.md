# leaflet-challenge
Module 15 - Leaflet Visualisations

Robertson, J

## File location

The javascript file, css file, and html file to create the map elements can be found in the 'Leaflet-Part-1' folder in the github repo.

## Scope and Overview

The purpose of this project is to create an iteractive visualisation to represent earthquake data from the past 24-hours. Earthquake data was accesseded from the U.S. Geological Service 'Past Day All Earhtquake Data' in GeoJSON Summary Format using the D3 library in JavaScript. The script source can be accessed with the below link to the script:

    Embed the script as a script element in the html body.

    https://d3js.org/d3.v7.min.js

Once the GeoJSON information has been accessed, pieces of earthquake information were extracted and stored in variables. The Leaflet plugin was used to generate map markers with a pop-up window activated on click to display the stored earthquake information data in an appealing manor.

The Leaflet plugin script and css can be accessed using it's script source from the below link:

    Ebmed the css script as a link element in the html head.

    https://unpkg.com/leaflet@1.9.4/dist/leaflet.css

    Embed the script as a script element in the html body.

    https://unpkg.com/leaflet@1.9.4/dist/leaflet.js

Using the Leaflet plugin a base world map was added to the html in a div element in the html body with the id 'map'. The earthquake location markers were added as an overlay map to the same element. Combined this creates a dashboard representing a global snapshot of earthquakes with the user able to view earthquake data by clicking through the map markers across the world.

## References

- U.S. Geological Survey. (2024) *USGS All Earthquakes, Past Day* [Data set]. https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson
- Agafonkin, V. (2010), *Interactive Choropleth Map*. https://leafletjs.com/examples/choropleth/
