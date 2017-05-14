"use strict"

//////////////////////////////////////////////////////
// Retrieve data from server, send to loop function //
//////////////////////////////////////////////////////

function getData() {

  // get food truck data
  var truckRequest = $.get("/data/trucks.json", loopDataTrucks);

  // get POPOS data
  var poposRequest = $.get("/data/popos.json", loopDataPopos);

  // get public art data
  var artRequest = $.get("/data/art.json", loopDataArt);

  // get neighborhood data
  var hoodRequest = $.get("/data/hoods.json", loopDataHoods);

  $.when(truckRequest, poposRequest, artRequest, hoodRequest).then(function() {
    plotMarker();
    planMyTrip();
    mapHelpers();
  });

}



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

function loopDataHoods(data) {
  for (var i = 0; i < data.length; i++) {
    plotDataHoods(data[i]);
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
  var contentString = "<head><link rel='stylesheet' href='/static/styles/mystyles.css'/></head><body><div id='content'>" +
      "<p>FOOD TRUCK</p>" +
      "<h3>" + title + "</h3>" + 
      "<p><button type='button' class='directions walkingDir btn btn-default btn-sm hidden-xs'>Walking Directions</button> " +
      "<button type='button' class='directions drivingDir btn btn-default btn-sm hidden-xs'>Driving Directions</button> " +
      "<button type='button' class='btn btn-default btn-sm hidden-xs' id='addToFavTrucks'>Add To Favorites</button></p>" +
      "<p><strong>Address:</strong> " + address + "</p>" +
      "<p><strong>Hours:</strong> " + hours + "</p>" +
      "<p><strong>Cuisine:</strong> " + cuisine + "</p>" +
      "<p><button type='button' class='btn btn-default btn-sm hidden-xs' id='nearbyTrucks'>Nearby Food Trucks</button> " +
      "<button type='button' class='btn btn-default btn-sm hidden-xs' id='nearbyPopos'>Nearby POPOS</button> " +
      "<button type='button' class='btn btn-default btn-sm hidden-xs' id='nearbyArt'>Nearby Art</button></p>" +
      "<p id='btnCenter'><button type='button' class='directions walkingDir btn btn-default btn-sm visible-xs hidden-sm hidden-md hidden-lg'>Walking Directions</button> " +
      "<button type='button' class='directions drivingDir btn btn-default btn-sm visible-xs hidden-sm hidden-md hidden-lg'>Driving Directions</button> " +
      "<button type='button' class='btn btn-default btn-sm visible-xs hidden-sm hidden-md hidden-lg' id='addToFavTrucks'>Add To Favorites</button></p>"
      "<div id='numLocations'></div>" + 
      "</div></body>";

  // exclude test data
  if (title != "BSM - TEST1") {

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
      icon: "/static/images/truck-dot.png"
      });

    // hide all markers if map_one or plan_trip
    if (document.getElementById("map_one") || 
        document.getElementById("plan_trip")) {
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
  var contentString = "<head><link rel='stylesheet' href='/static/styles/mystyles.css'/></head><body><div id='content'>" +
      "<p>POPOS</p>" +
      "<h3>" + title + "</h3>" +
      "<p><button type='button' class='directions walkingDir btn btn-default btn-sm hidden-xs'>Walking Directions</button> " +
      "<button type='button' class='directions drivingDir btn btn-default btn-sm hidden-xs'>Driving Directions</button> " +
      "<button type='button' class='btn btn-default btn-sm hidden-xs' id='addToFavPopos'>Add To Favorites</button></p>" +
      "<p><strong>Address:</strong> " + address + "</p>" +
      "<p><strong>Hours:</strong> " + hours + "</p>" +
      "<p><strong>Type:</strong> " + type + "</p>" +
      "<p><strong>Location:</strong> " + location + "</p>" +
      "<p><strong>Year:</strong> " + year + "</p>" +
      "<p>" + desc + "</p>" +
      "<p><button type='button' class='btn btn-default btn-sm hidden-xs' id='nearbyTrucks'>Nearby Food Trucks</button> " +
      "<button type='button' class='btn btn-default btn-sm hidden-xs' id='nearbyPopos'>Nearby Popos</button> " +
      "<button type='button' class='btn btn-default btn-sm hidden-xs' id='nearbyArt'>Nearby Art</button></p>" +
      "<p id='btnCenter'><button type='button' class='directions walkingDir btn btn-default btn-sm visible-xs hidden-sm hidden-md hidden-lg'>Walking Directions</button> " +
      "<button type='button' class='directions drivingDir btn btn-default btn-sm visible-xs hidden-sm hidden-md hidden-lg'>Driving Directions</button> " +
      "<button type='button' class='btn btn-default btn-sm visible-xs hidden-sm hidden-md hidden-lg' id='addToFavPopos'>Add To Favorites</button></p>" +
      "<div id='numLocations'></div>" + 
      "</div></body>";

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
    icon: "/static/images/popos-dot.png"
  });

  // hide all markers if map_one or plan_trip
  if (document.getElementById("map_one") || 
      document.getElementById("plan_trip")) {
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
  var contentString = "<head><link rel='stylesheet' href='/static/styles/mystyles.css'/></head><body><div id='content'>" +
      "<p>PUBLIC ART</p>" +
      "<h3>" + title + "</h3>" +
      "<p><button type='button' class='directions walkingDir btn btn-default btn-sm hidden-xs'>Walking Directions</button> " +
      "<button type='button' class='directions drivingDir btn btn-default btn-sm hidden-xs'>Driving Directions</button> " +
      "<button type='button' class='btn btn-default btn-sm hidden-xs' id='addToFavArt'>Add To Favorites</button></p>" +
      "<p><strong>Address:</strong> " + address + "</p>" +
      "<p><strong>Location:</strong> " + location + "</p>" +
      "<p><strong>Type:</strong> " + type + "</p>" +
      "<p><strong>Medium:</strong> " + medium + "</p>" +
      "<p><a target='_blank' href='" + link + "'>" + link + "</a></p>" +
      "<p><button type='button' class='btn btn-default btn-sm hidden-xs' id='nearbyTrucks'>Nearby Food Trucks</button> " +
      "<button type='button' class='btn btn-default btn-sm hidden-xs' id='nearbyPopos'>Nearby POPOS</button> " +
      "<button type='button' class='btn btn-default btn-sm hidden-xs' id='nearbyArt'>Nearby Art</button></p>" +
      "<p id='btnCenter'><button type='button' class='directions walkingDir btn btn-default btn-sm visible-xs hidden-sm hidden-md hidden-lg'>Walking Directions</button> " +
      "<button type='button' class='directions drivingDir btn btn-default btn-sm visible-xs hidden-sm hidden-md hidden-lg'>Driving Directions</button> " +
      "<button type='button' class='btn btn-default btn-sm visible-xs hidden-sm hidden-md hidden-lg' id='addToFavArt'>Add To Favorites</button></p>" +
      "<div id='numLocations'></div>" + 
      "</div></body>";

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
    icon: "/static/images/art-dot.png"
  });

  // hide all markers if map_one or plan_trip
  if (document.getElementById("map_one") || 
      document.getElementById("plan_trip")) {
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



function plotDataHoods(data) {

  var feature = {
    type: "Feature",
    geometry: data.the_geom,
    properties: {
      name: data.name,
      link: data.link,
      selected: false
    }
  };

  map.data.addGeoJson(feature);
}



/////////////
// Map one //
/////////////

function plotMarker() {
  if (document.getElementById("map_one")) {

    $("#truckMap, #poposMap, #artMap, #hoodMap").prop("checked", false);
    map.data.setStyle({visible: false});
    var allMarkers = truckMarkers.concat((poposMarkers.concat(artMarkers)));

    var lat = $("#lat").val();
    var lng = $("#lng").val();
    var identifier = $("#identifier").val();

    var markerFound = false;

    for (var marker of allMarkers) {
      if (marker.lat == lat && 
          marker.lng == lng && 
          marker.searchDetails.includes(identifier) ) {
        marker.setVisible(true);
        markerFound = true;
      } else {
        marker.setVisible(false);
      }
    }
    if (!markerFound) {
      alert("Uh oh! It looks like this space has moved or no longer exists.");
    }
  }
}