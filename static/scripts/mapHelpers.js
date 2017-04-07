"use strict"

$(document).ready(function() {

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


  $("#resetMap").on("click", function() {
    
    var allMarkers = truckMarkers.concat((poposMarkers.concat(artMarkers)));
    for (var marker of allMarkers) {
      marker.setVisible(true);
    }
    
    // DOM indicator that reset has been clicked, prevents
    // new map from being made in initMap()
    $("#resetMap").removeClass("newMap");

    $("#truckMap, #poposMap, #artMap").prop("checked", true);
    $("#search").val("");
    infoWindow.close();

    directionsDisplay.setMap(null);
    directionsDisplay.setPanel(null);
    
    initMap();

  });



  /////////////////////////////////////
  // Toggle marker visibility on map //
  /////////////////////////////////////

  $("#truckMap").on("change", function() {
    for (var marker of truckMarkers) {
      if ($("#truckMap").is(":checked")) {
        marker.setVisible(true);
    } else {
        marker.setVisible(false);
      }
    }
  });

  $("#poposMap").on("change", function() {
    for (var marker of poposMarkers) {
      if ($("#poposMap").is(":checked")) {
        marker.setVisible(true);
      } else {
        marker.setVisible(false);
      }
    }
  });

  $("#artMap").on("change", function() {
    for (var marker of artMarkers) {
      if ($("#artMap").is(":checked")) {
        marker.setVisible(true);
      } else {
        marker.setVisible(false);
      }
    }
  });



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



  //////////////////////
  // Nearby locations //
  //////////////////////


  function getNearbyMarkers(evt) {

    var allMarkers = truckMarkers.concat((poposMarkers.concat(artMarkers)));

    for (var marker of allMarkers) {
        marker.setVisible(false);
      }

    var p1 = evt.data.currentMarker.position;
    evt.data.currentMarker.setVisible(true);

    for (var marker of evt.data.markers) {
      var p2 = marker.position;
      var distance = (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000);

      if (distance < 1.6) {
        marker.setVisible(true);
      }
    }
  }


  google.maps.event.addListener(infoWindow, 'domready', function() {
    var data = {
      currentMarker: this.marker,
      markers: truckMarkers
    }
    $("#nearbyTrucks").on("click", data, getNearbyMarkers);

    data = {
      currentMarker: this.marker,
      markers: poposMarkers
    }
    $("#nearbyPopos").on("click", data, getNearbyMarkers);

    data = {
      currentMarker: this.marker,
      markers: artMarkers
    }
    $("#nearbyArt").on("click", data, getNearbyMarkers);
  });


}); // end document.ready