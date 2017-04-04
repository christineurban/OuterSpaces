"use strict"

////////////////////////////////////
// Initalize map of San Francisco //
////////////////////////////////////


function initMap() {
  
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var infoWindow = new google.maps.InfoWindow( {
    maxWidth: 350
  });
  var sanFrancisco = {lat: 37.7599, lng: -122.440558};
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: sanFrancisco
  });
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
    var hours = data.dayshours;
    var cuisine = data.fooditems;
    var searchDetails = (title + address + cuisine).toLowerCase();

    // custom info window string
    var contentString = "<div id='content'>" +
        "<p>FOOD TRUCK</p>" +
        "<h3>" + title + "</h3>" + 
        "<p><button id='addToFavTrucks'>Add to Favorites</button> " +
        "<button class='directions'>Directions</button></p>" +
        "<p><strong>Address:</strong> " + address + "</p>" +
        "<p><strong>Hours:</strong> " + hours + "</p>" +
        "<p><strong>Cuisine:</strong> " + cuisine + "</p>" +
        "<p><button id='nearbyTrucksFromTruck'>Nearby Food Trucks</button> " +
        "<button id='nearbyPoposFromTruck'>Nearby POPOS</button> " +
        "<button id='nearbyArtFromTruck'>Nearby Art</button></p>" +
        "</div>";

    // create marker
    var marker = new google.maps.Marker({
      map: map,
      position: latLng,
      title: title,
      address: address,
      hours: hours,
      cuisine: cuisine,
      lat: coords[1],
      lng: coords[0],
      searchDetails: searchDetails,
      // http://stackoverflow.com/questions/11162740/where-i-can-find-the-little-red-dot-image-used-in-google-map
      icon: "https://storage.googleapis.com/support-kms-prod/SNP_2752129_en_v0"
      });
    
    // show info window on click  
    marker.addListener("click", function(){
      infoWindow.close();   // Close previously opened info window
      infoWindow.setContent(contentString);
      // assign marker info to info window for adding to favorites
      infoWindow.marker = marker;
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
    var hours = data.hours;
    var location = data.location;
    var type = data.type;
    var desc = data.descriptio;
    var year = data.year;
    var searchDetails = (title + address + 
      location + type + desc).toLowerCase();

    // custom info window string
    var contentString = "<div id='content'>" +
        "<p><strong>POPOS</strong></p>" +
        "<h3>" + title + "</h3>" +
        "<p><button id='addToFavPopos'>Add to Favorites</button> " +
        "<button class='directions'>Directions</button></p>" +
        "<p><strong>Address:</strong> " + address + "</p>" +
        "<p><strong>Hours:</strong> " + hours + "</p>" +
        "<p><strong>Type:</strong> " + type + "</p>" +
        "<p><strong>Location:</strong> " + location + "</p>" +
        "<p>" + desc + "</p>" +
        "<p>" + year + "</p>" +
        "<p><button id='nearbyTrucksFromPopos'>Nearby Food Trucks</button> " +
        "<button id='nearbyPoposFromPopos'>Nearby Popos</button> " +
        "<button id='nearbyArtFromPopos'>Nearby Art</button></p>" +
        "</div>";

    // create marker
    var marker = new google.maps.Marker({
      map: map,
      position: latLng,
      title: title,
      address: address,
      hours: hours,
      type: type,
      location: location,
      desc: desc,
      year: year,
      lat: coords[1],
      lng: coords[0],
      searchDetails: searchDetails,
      icon: "https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle_blue.png"
    });

    // show info window on click
    marker.addListener("click", function(){
      infoWindow.close();   // Close previously opened info window
      infoWindow.setContent(contentString);
      // assign marker info to info window for adding to favorites
      infoWindow.marker = marker;
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
    var searchDetails = (title + address + location + 
      type + medium + link).toLowerCase();

    // custom info window string
    var contentString = "<div id='content'>" +
        "<p><strong>PUBLIC ART</strong></p>" +
        "<h3>" + title + "</h3>" +
        "<p><button id='addToFavArt'>Add to Favorites</button> " +
        "<button class='directions'>Directions</button></p>" +
        "<p><strong>Address:</strong> " + address + "</p>" +
        "<p><strong>Location:</strong> " + location + "</p>" +
        "<p><strong>Type:</strong> " + type + "</p>" +
        "<p><strong>Medium:</strong> " + medium + "</p>" +
        "<p><a target='_blank' href='" + link + "'>" + link + "</a></p>" +
        "<p><button id='nearbyTrucksFromArt'>Nearby Food Trucks</button> " +
        "<button id='nearbyPoposFromArt'>Nearby POPOS</button> " +
        "<button id='nearbyArtFromArt'>Nearby Art</button></p>" +
        "</div>";

    // create marker
    var marker = new google.maps.Marker({
      map: map,
      position: latLng,
      title: title,
      address: address,
      location: location,
      type: type,
      medium: medium,
      link: link,
      lat: coords[1],
      lng: coords[0],
      searchDetails: searchDetails,
      icon: "https://storage.googleapis.com/support-kms-prod/SNP_2752264_en_v0"
    });

    // show info window on click
    marker.addListener("click", function(){
      infoWindow.close();   // Close previously opened info window
      infoWindow.setContent(contentString);
      // assign marker info to info window for adding to favorites
      infoWindow.marker = marker;
      infoWindow.open(map, marker);
    });

    // collect all markers in array
    artMarkers.push(marker);
  }



  /////////////////////////////////////////////
  // On checkbox change, call toggle function //
  /////////////////////////////////////////////

  $("#truckMap").on("change", toggleTruckMarkers);

  $("#poposMap").on("change", togglePoposMarkers);

  $("#artMap").on("change", toggleArtMarkers);



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



  ////////////////
  // Search box //
  ////////////////

  function submitSearch(evt) {
      evt.preventDefault();
      infoWindow.close();

      var search = $("#search").val().toLowerCase();
      var allMarkers = truckMarkers.concat((poposMarkers.concat(artMarkers)));

      for (var marker of allMarkers) {
        if (String(marker.searchDetails).includes(search)) {
          marker.setVisible(true);
        } else {
          marker.setVisible(false);
        }
      } 
  }

  $("#searchForm").on("submit", submitSearch);



  ///////////////
  // Reset map //
  ///////////////

  function resetMap(evt) {
    $("#search").val("");
    $("#truckMap, #poposMap, #artMap").prop("checked", true);
    infoWindow.close();
  }

  $("#resetMap").on("click", resetMap);



  ////////////////
  // Directions //
  ////////////////

  function showDirections(evt) {

    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.setCenter(pos);
      var request = {
       origin: pos,
       destination: evt.data,
       travelMode: google.maps.DirectionsTravelMode.DRIVING
     };

    directionsService.route(request, function (response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
     });
    });
  }

  // http://stackoverflow.com/questions/6378007/adding-event-to-element-inside-google-maps-api-infowindow
  google.maps.event.addListener(infoWindow, 'domready', function() {
    var destination = $(this).attr("position");
    $(".directions").on("click", destination, showDirections);
  });



  //////////////////////
  // Add to favorites //
  //////////////////////

  
  function addedToFavorites(result) {
    alert(result);
  }


  function addToFavTrucks(evt) {
    var info = {
      "name": evt.data.title,
      "address": evt.data.address,
      "hours": evt.data.hours,
      "cuisine": evt.data.cuisine,
      "lat": evt.data.lat,
      "lng": evt.data.lng,
      };

    $.post("/favorite-truck",
           info,
           addedToFavorites);
  }


  function addToFavPopos(evt) {
    var info = {
      "name": evt.data.title,
      "address": evt.data.address,
      "hours": evt.data.hours,
      "popos_type": evt.data.type,
      "location": evt.data.location,
      "description": evt.data.desc,
      "year": evt.data.year,
      "lat": evt.data.lat,
      "lng": evt.data.lng,
      };

    $.post("/favorite-popos",
           info,
           addedToFavorites);
  }


  function addToFavArt(evt) {
    var info = {
      "title": evt.data.title,
      "address": evt.data.address,
      "location": evt.data.location,
      "art_type": evt.data.type,
      "medium": evt.data.medium,
      "artist_link": evt.data.link,
      "lat": evt.data.lat,
      "lng": evt.data.lng,
      };

    $.post("/favorite-art",
           info,
           addedToFavorites);
  }



  google.maps.event.addListener(infoWindow, 'domready', function() {
    var favorite = this.marker;
    $("#addToFavTrucks").on("click", favorite, addToFavTrucks);
  });  

  google.maps.event.addListener(infoWindow, 'domready', function() {
    var favorite = this.marker;
    $("#addToFavPopos").on("click", favorite, addToFavPopos);
  });  

  google.maps.event.addListener(infoWindow, 'domready', function() {
    var favorite = this.marker;
    $("#addToFavArt").on("click", favorite, addToFavArt);
  });




} // end of initMap()