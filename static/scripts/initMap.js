"use strict"

function initMap() {

  ////////////////////////////////////
  // Initalize map of San Francisco //
  ////////////////////////////////////
  
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  map = new google.maps.Map(document.getElementById("map"), mapOptions);

  infoWindow = new google.maps.InfoWindow({
    maxWidth: 410
  });
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById("textDirections"));

  map.data.setStyle({
    fillOpacity: 0.0,
    strokeWeight: 1
  });

  if (!document.getElementById("plan_trip")) {
    map.setZoom(13);
    map.setCenter(sanFrancisco);
  }

  // if map_one, center on that location
  if (document.getElementById("lat")) {
    map.setCenter({
      lat: parseFloat(document.getElementById("lat").value),
      lng: parseFloat(document.getElementById("lng").value)
    });
  } else {
    map.setCenter(sanFrancisco);
  }

  getData();

} // end initMap()

