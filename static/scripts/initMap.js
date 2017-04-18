"use strict"


function initMap() {

  ////////////////////////////////////
  // Initalize map of San Francisco //
  ////////////////////////////////////
  
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: sanFrancisco
  });
  infoWindow = new google.maps.InfoWindow({
    maxWidth: 350
  });
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById("textDirections"));

  map.data.setStyle({
    fillOpacity: 0.0,
    strokeWeight: 1
  });


  ///////////////////////////
  // Try HTML5 geolocation //
  ///////////////////////////

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var marker = new google.maps.Marker({
        position: pos,
        map: map
      });

      // if map_one, center on that location
      if (document.getElementById("lat")) {
        map.setCenter({
          lat: parseFloat(document.getElementById("lat").value),
          lng: parseFloat(document.getElementById("lng").value)
        });
      } else {
        map.setCenter(sanFrancisco);
      }

    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }


  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
          infoWindow.setPosition(pos);
          infoWindow.setContent(browserHasGeolocation ?
                                'Error: The Geolocation service failed.' :
                                'Error: Your browser doesn\'t support geolocation.');
  }

  getData();

} // end initMap()

