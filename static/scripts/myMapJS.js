"use strict"

////////////////////////////////////
// Initalize map of San Francisco //
////////////////////////////////////

var map;

function initMap() {
  var sanFrancisco = {lat: 37.7599, lng: -122.440558};
  var mapOptions = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: sanFrancisco
  });
  map = mapOptions;
}



$(document).ready(function() {


  ///////////////////////////////
  // Retrieve data from server //
  ///////////////////////////////

  // get food truck data
  $.get("/data/trucks.json",
        plotDataTrucks);

  // get POPOS data
  $.get("/data/popos.json",
        plotDataPopos);

  // get public art data
  $.get("/data/art.json",
        plotDataArt);



  //////////////////////////////////////
  // Retrieve data and store in array //
  //////////////////////////////////////

  var truckMarkers = [];
  var artMarkers = [];
  var poposMarkers = [];


  function plotDataTrucks(data) {
    
    for (var i = 0; i < data.length; i++) {
      var coords = data[i].location.coordinates;
      var latLng = new google.maps.LatLng(coords[1],coords[0]);
      var title = data[i].applicant;
      var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: title,
        // http://stackoverflow.com/questions/11162740/where-i-can-find-the-little-red-dot-image-used-in-google-map
        icon: "https://storage.googleapis.com/support-kms-prod/SNP_2752129_en_v0"
      });
      // collect all markers in array
      truckMarkers.push(marker);
    }
  }


  function plotDataPopos(data) {
    
    for (var i = 0; i < data.length; i++) {
      var coords = data[i].the_geom.coordinates;
      var latLng = new google.maps.LatLng(coords[1],coords[0]);
      var title = data[i].name;
      var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: title,
        icon: "https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle_blue.png"
      });
      // collect all markers in array
      poposMarkers.push(marker);
    }
  }


  function plotDataArt(data) {

    for (var i = 0; i < data.length; i++) {
      var coords = data[i].the_geom.coordinates;
      var latLng = new google.maps.LatLng(coords[1],coords[0]);
      var title = data[i].title;
      var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: title,
        icon: "https://storage.googleapis.com/support-kms-prod/SNP_2752264_en_v0"
      });
      // collect all markers in array
      artMarkers.push(marker);
    }
  }



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

  // On checkbox click, call toggle function

  $("#truckMap").on("click", function() {
      toggleTruckMarkers();
  });

  $("#poposMap").on("click", function() {
      togglePoposMarkers();
  });

  $("#artMap").on("click", function() {
      toggleArtMarkers();
  });

});