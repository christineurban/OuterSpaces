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

    // get food truck data from server
    $.get("/data/trucks.json",
          plotDataTrucks);

    // get POPOS data from server
    $.get("/data/popos.json",
          plotDataPopos);

    // get public art data from server
    $.get("/data/art.json",
          plotDataArt);

  ////////////////////////////////////////
  // Retrieve data and show/hide on map //
  ////////////////////////////////////////

  // plot food truck data
  function plotDataTrucks(data) {
    
    for (var i = 0; i < data.length; i++) {
      var coords = data[i].location.coordinates;
      var latLng = new google.maps.LatLng(coords[1],coords[0]);
      var title = data[i].applicant;
      
      if ($("#truckMap").is(":checked")) {
        var marker = new google.maps.Marker({
          position: latLng,
          map: map,
          title: title,
          // http://stackoverflow.com/questions/11162740/where-i-can-find-the-little-red-dot-image-used-in-google-map
          icon: "https://storage.googleapis.com/support-kms-prod/SNP_2752129_en_v0"
        });
      } else {
        marker.setVisible(false);
      }
    }
  }

  // plot POPOS data
  function plotDataPopos(data) {
    
    for (var i = 0; i < data.length; i++) {
      var coords = data[i].the_geom.coordinates;
      var latLng = new google.maps.LatLng(coords[1],coords[0]);
      var title = data[i].name;

      if ($("#poposMap").is(":checked")) {
        var marker = new google.maps.Marker({
          position: latLng,
          map: map,
          title: title,
          icon: "https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle_blue.png"
        });
      } else {
        marker.setVisible(false);
      }
    }
  }


  var artMarkers = [];

  // plot public art data
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
      artMarkers.push(marker);
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

  // get food truck data from server
  function getTruckData() {
    $.get("/data/trucks.json",
          plotDataTrucks);
    console.log("getTruckData");
  }

  // get POPOS data from server
  function getPoposData() {
    $.get("/data/popos.json",
          plotDataPopos);
    console.log("getPoposData");
  }

  // get public art data from server
  function getArtData() {
    $.get("/data/art.json",
          plotDataArt);
    console.log("getArtData");
  }



  $('#truckMap').on("click", function() {
      console.log("truck");

      if($("#truckMap").prop("checked")) {
        getTruckData();
      } else {
        getTruckData();
      }
  });

  $('#poposMap').on("change", function() {
      console.log("popos");

      if($("#poposMap").prop("checked")) {
        getPoposData();
      } else {
        getPoposData();
      }
  });

  $('#artMap').on("change", function() {
      console.log("art");
      toggleArtMarkers();
  });

});