"use strict"

var directionsService;
var directionsDisplay;
var infoWindow;
var map;

var truckMarkers = [];
var artMarkers = [];
var poposMarkers = [];


// function createMarkers() {

  //////////////////////////////////////////////////////
  // Retrieve data from server, send to loop function //
  //////////////////////////////////////////////////////

  // get food truck data
  $.get("/data/trucks.json",
    loopDataTrucks).then(plotOne);

  // get POPOS data
  $.get("/data/popos.json",
    loopDataPopos).then(plotOne);

  // get public art data
  $.get("/data/art.json",
    loopDataArt).then(plotOne);



  ////////////////////////////////////////////////////////////
  // Iterate through all data points, send to plot function //
  ////////////////////////////////////////////////////////////

  function loopDataTrucks(data) {
    if (data === "Truck data request failed") {
      console.log(data);
    } else {
      for (var i = 0; i < data.length; i++) {
        plotDataTrucks(data[i]);
      }
    }
  }

  function loopDataPopos(data) {
    if (data === "POPOS data request failed") {
      console.log(data);
    } else {
      for (var i = 0; i < data.length; i++) {
        plotDataPopos(data[i]);
      }
    }
  }

  function loopDataArt(data) {
    if (data === "Art data request failed") {
      console.log(data);
    } else {
      for (var i = 0; i < data.length; i++) {
        plotDataArt(data[i]);
      }
    }
  }



  //////////////////////////////////
  // Plot data and store in array //
  //////////////////////////////////


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
        "<p><button id='nearbyTrucks'>Nearby Food Trucks</button> " +
        "<button id='nearbyPopos'>Nearby POPOS</button> " +
        "<button id='nearbyArt'>Nearby Art</button></p>" +
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
      icon: "../static/images/green-dot.png"
      });

    // hide all markers if showing favorite on map
    if (document.getElementById("show_fav_on_map")) {
      marker.setVisible(false);
    }
    
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
        "<p><button id='nearbyTrucks'>Nearby Food Trucks</button> " +
        "<button id='nearbyPopos'>Nearby Popos</button> " +
        "<button id='nearbyArt'>Nearby Art</button></p>" +
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
      icon: "../static/images/blue-dot.png"
    });

    // hide all markers if showing favorite on map
    if (document.getElementById("show_fav_on_map")) {
      marker.setVisible(false);
    }

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
        "<p><button id='nearbyTrucks'>Nearby Food Trucks</button> " +
        "<button id='nearbyPopos'>Nearby POPOS</button> " +
        "<button id='nearbyArt'>Nearby Art</button></p>" +
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
      icon: "../static/images/pink-dot.png"
    });

    // hide all markers if showing favorite on map
    if (document.getElementById("show_fav_on_map")) {
      marker.setVisible(false);
    }
    

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



  /////////////////////
  // Show one on map //
  /////////////////////

  function plotOne() {
    if (document.getElementById("show_one_on_map")) {

      var lat = $("#lat").val();
      var lng = $("#lng").val();

      var allMarkers = truckMarkers.concat((poposMarkers.concat(artMarkers)));

      for (var marker of allMarkers) {
        if (marker.lat == lat && marker.lng == lng) {
          marker.setVisible(true);
        } else {
          marker.setVisible(false);
        }
      }
    }
  }
// }