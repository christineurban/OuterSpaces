"use strict"

////////////////////////////////////
// Initalize map of San Francisco //
////////////////////////////////////

var map;
var infoWindow;

function initMap() {
  var info = new google.maps.InfoWindow( {
    maxWidth: 350
  });
  var sanFrancisco = {lat: 37.7599, lng: -122.440558};
  var mapOptions = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: sanFrancisco
  });
  map = mapOptions;
  infoWindow = info;


  // Try HTML5 geolocation.
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

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
      }


$(document).ready(function() {

  //////////////////////////////////////////////////////
  // Retrieve data from server, send to loop function //
  //////////////////////////////////////////////////////

  // get food truck data
  $.get("/data/trucks.json",
        loopDataTrucks);

  // get POPOS data
  $.get("/data/popos.json",
        loopDataPopos);

  // get public art data
  $.get("/data/art.json",
        loopDataArt);



  ////////////////////////////////////////////////////////////
  // Iterate through all data points, send to plot function //
  ////////////////////////////////////////////////////////////
  
  function loopDataTrucks(data) {
    for (var i = 0; i < data.length; i++) {
      plotDataTrucks(data[i]);
    }
  }

  function loopDataPopos(data) {
    for (var i = 0; i < data.length; i++) {
      plotDataPopos(data[i]);
    }
  }

  function loopDataArt(data) {
    for (var i = 0; i < data.length; i++) {
      plotDataArt(data[i]);
    }
  }



  //////////////////////////////////
  // Plot data and store in array //
  //////////////////////////////////

  var truckMarkers = [];
  var artMarkers = [];
  var poposMarkers = [];


  function plotDataTrucks(data) {

    var coords = data.location.coordinates;
    var latLng = new google.maps.LatLng(coords[1],coords[0]);
    var title = data.applicant;
    var address = data.address;
    var schedule = data.dayshours;
    var cuisine = data.fooditems;

    // custom info window string
    var contentString = "<div id='content'>" +
        "<p>FOOD TRUCK</p>" +
        "<h3>" + title + "</h3>" + 
        "<p><button id='addToFavTrucks'>Add to Favorites</button></p>" +
        "<p><strong>Address:</strong> " + address + "</p>" +
        "<p><strong>Hours:</strong> " + schedule + "</p>" +
        "<p><strong>Cuisine:</strong> " + cuisine + "</p>" +
        "<button id='nearbyTrucksFromTruck'>Nearby Food Trucks</button> " +
        "<button id='nearbyPoposFromTruck'>Nearby POPOS</button> " +
        "<button id='nearbyArtFromTruck'>Nearby Art</button>" +
        "</div>";

    // create marker
    var marker = new google.maps.Marker({
      position: latLng,
      map: map,
      title: title,
      // http://stackoverflow.com/questions/11162740/where-i-can-find-the-little-red-dot-image-used-in-google-map
      icon: "https://storage.googleapis.com/support-kms-prod/SNP_2752129_en_v0"
      });
    
    // show info window on click  
    marker.addListener("click", function(){
      infoWindow.close(); // Close previously opened infowindow
      infoWindow.setContent(contentString);
      infoWindow.open(map, marker);
    });

    // collect all markers in array
    truckMarkers.push(marker);
  }


  function plotDataPopos(data) {
    
    var coords = data.the_geom.coordinates;
    var latLng = new google.maps.LatLng(coords[1],coords[0]);
    var title = data.name;
    var address = data.popos_addr;
    var schedule = data.hours;
    var location = data.location;
    var type = data.type;
    var desc = data.descriptio;

    // custom info window string
    var contentString = "<div id='content'>" +
        "<p><strong>POPOS</strong></p>" +
        "<h3>" + title + "</h3>" +
        "<p><button id='addToFavPopos'>Add to Favorites</button></p>" +
        
        "<p><strong>Address:</strong> " + address + "</p>" +
        "<p><strong>Hours:</strong> " + schedule + "</p>" +
        "<p><strong>Type:</strong> " + type + "</p>" +
        "<p><strong>Location:</strong> " + location + "</p>" +
        "<p>" + desc + "</p>" +
        "<button id='nearbyTrucksFromPopos'>Nearby Food Trucks</button> " +
        "<button id='nearbyPoposFromPopos'>Nearby Popos</button> " +
        "<button id='nearbyArtFromPopos'>Nearby Art</button>" +
        "</div>";

    // create marker
    var marker = new google.maps.Marker({
      position: latLng,
      map: map,
      title: title,
      icon: "https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle_blue.png"
    });

    // show info window on click
    marker.addListener("click", function(){
      infoWindow.close(); // Close previously opened infowindow
      infoWindow.setContent(contentString);
      infoWindow.open(map, marker);
    });

    // collect all markers in array
    poposMarkers.push(marker);
  }
  

  function plotDataArt(data) {
    
    var coords = data.the_geom.coordinates;
    var latLng = new google.maps.LatLng(coords[1],coords[0]);
    var title = data.title;
    var address = data.name;
    var location = data.location;
    var type = data.type;
    var medium = data.medium;
    var link = data.artistlink;

    // custom info window string
    var contentString = "<div id='content'>" +
        "<p><strong>PUBLIC ART</strong></p>" +
        "<h3>" + title + "</h3>" +
        "<p><button id='addToFavArt'>Add to Favorites</button></p>" +
        "<p><strong>Address:</strong> " + address + "</p>" +
        "<p><strong>Location:</strong> " + location + "</p>" +
        "<p><strong>Type:</strong> " + type + "</p>" +
        "<p><strong>Medium:</strong> " + medium + "</p>" +
        "<p><a target='_blank' href='" + link + "'>" + link + "</a></p>" +
        "<button id='nearbyTrucksFromArt'>Nearby Food Trucks</button> " +
        "<button id='nearbyPoposFromArt'>Nearby POPOS</button> " +
        "<button id='nearbyArtFromArt'>Nearby Art</button>" +
        "</div>";

    // create marker
    var marker = new google.maps.Marker({
      position: latLng,
      map: map,
      title: title,
      icon: "https://storage.googleapis.com/support-kms-prod/SNP_2752264_en_v0"
    });

    // show info window on click
    marker.addListener("click", function(){
      infoWindow.close(); // Close previously opened infowindow
      infoWindow.setContent(contentString);
      infoWindow.open(map, marker);
    });

    // collect all markers in array
    artMarkers.push(marker);
  }



  /////////////////////////////////////////////
  // On checkbox click, call toggle function //
  /////////////////////////////////////////////

  $("#truckMap").on("click", function() {
      toggleTruckMarkers();
  });

  $("#poposMap").on("click", function() {
      togglePoposMarkers();
  });

  $("#artMap").on("click", function() {
      toggleArtMarkers();
  });



  /////////////////////////////////////
  // Toggle marker visibility on map //
  /////////////////////////////////////

  function toggleTruckMarkers(evt) {
    if ($("#truckMap").is(":checked")) {
      for (var marker of truckMarkers) {
        marker.setVisible(true);
      }
    } else {
      for (var marker of truckMarkers) {
        marker.setVisible(false);
      }
    }
  }


  function togglePoposMarkers(evt) {
    if ($("#poposMap").is(":checked")) {
      for (var marker of poposMarkers) {
        marker.setVisible(true);
      }
    } else {
      for (var marker of poposMarkers) {
        marker.setVisible(false);
      }
    }
  }


  function toggleArtMarkers(evt) {
    if ($("#artMap").is(":checked")) {
      for (var marker of artMarkers) {
        marker.setVisible(true);
      }
    } else {
      for (var marker of artMarkers) {
        marker.setVisible(false);
      }
    }
  }

});