"use strict"

$(window).load(function() {

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

    // hide all markers
    var allMarkers = truckMarkers.concat((poposMarkers.concat(artMarkers)));
    for (var marker of allMarkers) {
        marker.setVisible(false);
      }

    // show current marker
    var p1 = evt.data.currentMarker.position;
    evt.data.currentMarker.setVisible(true);

    for (var marker of evt.data.markers) {
      var p2 = marker.position;
      // calucate distance between in meters/ divide by 1600 to get to miles
      var distance = (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1600);

      // show markers within half a mile
      if (distance < 0.5) {
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



  //////////////////
  // Plan My Trip //
  //////////////////

  if (document.getElementById("plan_trip")) {

    // get current location
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var currentMarker = new google.maps.Marker({
        position: pos,
        map: map
      });
      // show current location
      currentMarker.setVisible(true);
      

      var p1 = new google.maps.LatLng(pos.lat, pos.lng);

      // hide all markers
      var allMarkers = truckMarkers.concat((poposMarkers.concat(artMarkers)));
      for (var marker of allMarkers) {
        marker.setVisible(false);
      }

      ////////////////////////
      // plot nearest truck //
      ////////////////////////

      var closestTruck;

      for (var marker of truckMarkers) {
        var p2 = new google.maps.LatLng(marker.lat, marker.lng);
        var distance = (google.maps.geometry.spherical.computeDistanceBetween(p1, p2));
        if (!closestTruck || closestTruck.distance > distance) {
          closestTruck = {
            marker: marker,
            distance: distance
          }
        }
      }
      closestTruck.marker.setVisible(true);
      p2 = new google.maps.LatLng(closestTruck.marker.lat, closestTruck.marker.lng);


      ////////////////////////
      // plot nearest POPOS //
      ////////////////////////

      var closestPopos;

      for (var marker of poposMarkers) {
        var p3 = new google.maps.LatLng(marker.lat, marker.lng);
        var distance = (google.maps.geometry.spherical.computeDistanceBetween(p2, p3));
        if (!closestPopos || closestPopos.distance > distance) {
          closestPopos = {
            marker: marker,
            distance: distance
          }
        }
      }
      closestPopos.marker.setVisible(true);
      p3 = new google.maps.LatLng(closestPopos.marker.lat, closestPopos.marker.lng);


      //////////////////////
      // plot nearest art //
      //////////////////////

      var closestArt;

      for (var marker of artMarkers) {
        var p4 = new google.maps.LatLng(marker.lat, marker.lng);
        var distance = (google.maps.geometry.spherical.computeDistanceBetween(p3, p4));
        if (!closestArt || closestArt.distance > distance) {
          closestArt = {
            marker: marker,
            distance: distance
          }
        }
      }
      closestArt.marker.setVisible(true);
      p4 = new google.maps.LatLng(closestArt.marker.lat, closestArt.marker.lng);


      ///////////////////////////////
      // directions between points //
      ///////////////////////////////

      var request = {
        origin: p1,
        destination: p4,
        waypoints: [
          {location: p2, stopover: true}, 
          {location: p3, stopover: true}
           ],
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


}); // end of window.load