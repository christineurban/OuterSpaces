"use strict"


function initMap() {

  ////////////////////////////////////
  // Initalize map of San Francisco //
  ////////////////////////////////////
  
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;

  // don't make new instance of map upon clicking reset
  if ($("#resetMap").hasClass("newMap")) {
    map = new google.maps.Map(document.getElementById("map"));
    infoWindow = new google.maps.InfoWindow( {
      maxWidth: 350
    });
  }
  
  var sanFrancisco = {lat: 37.7599, lng: -122.440558};
  map.setZoom(13);
  map.setCenter(sanFrancisco);
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById("textDirections"));



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
      map.setCenter(pos);
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

} // end initMap()

