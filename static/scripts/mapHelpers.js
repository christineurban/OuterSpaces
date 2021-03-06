"use strict"

function mapHelpers() {

  ////////////////
  // Search box //
  ////////////////

  function submitSearch(evt) {
      evt.preventDefault();
      infoWindow.close();
      map.setCenter(sanFrancisco);
      map.setZoom(13);
      map.data.setStyle({visible: false});

      var search = $(".searchMap").val().toLowerCase();
      var allMarkers = truckMarkers.concat((poposMarkers.concat(artMarkers)));
      var counter = 0

      for (var marker of allMarkers) {
        if (String(marker.searchDetails).includes(search)) {
          marker.setVisible(true);
          counter++;
        } else {
          marker.setVisible(false);
        }
      }

      $("#numLocationsSearch").html(counter + " OuterSpaces match your \
                                              search criteria");
      $("#numLocationsAddress").empty();
  }

  $("#searchForm").on("submit", submitSearch);



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

  $("#hoodMap").on("change", function() {
    if ($("#hoodMap").is(":checked")) {
      map.data.setStyle({visible: true});
      map.data.setStyle({
        fillOpacity: 0.0,
        strokeWeight: 1
      });
    } else {
      map.data.setStyle({visible: false});
    }
  });



  ////////////////
  // Directions //
  ////////////////


  function showDirections(evt) {
    evt.preventDefault();
    infoWindow.close();
    $("#pageModal").modal("hide");

    var addressFrom = $("#directionsFromAddress").val();
    var position = $("#directionsPosition").val();
    var title = $("#directionsTitle").val();
    var addressTo = $("#directionsAddress").val();
    
    var request = {
     origin: addressFrom,
     destination: addressTo + " san francisco",
     travelMode: google.maps.DirectionsTravelMode[travel]
    };

    // http://stackoverflow.com/questions/18954463/
    //modifying-google-maps-default-directions-title
    // first hide the panel
    directionsDisplay.getPanel().style.visibility="hidden";
    $("#numLocationsSearch").empty();
    $("#numLocationsAddress").empty();

    // set the directions
    directionsService.route(request, function (response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      } else {
        window.alert("Directions request failed due to " + status);
      }
     });

    // custom titles for directions panel
    var panelTitle = [
      "<div style='font-weight:bold'>" + addressFrom + "</div>Get me to OuterSpace!",
      "<div style='font-weight:bold'>" + title + "</div>" + addressTo
    ]

    setTimeout(function(){
      // fetch the elements
      var nodes = 
          directionsDisplay.getPanel().querySelectorAll("td.adp-text");
      for (var i = 0; i < nodes.length; i++) {
        // assign the text-content of the element to the innerHTML-property
        nodes[i].innerHTML = panelTitle[i];
    }
      // show the panel
      $(".warnbox-content, .warnbox-c1, .warnbox-c2").hide();
      directionsDisplay.getPanel().style.visibility="visible";
    }, 1000);
  }


  $(document).on("submit", "#directionsForm", showDirections);

  function directionsModal(evt) {
    var position = evt.data.position;
    var title = evt.data.title;
    var address = evt.data.address;
    $("#pageModal").modal();
    $("#pageModalHtml").html(
      'Enter an address:<br>' +
      '<form id="directionsForm">' +
        '<div class="form-group">' +
          '<label class="sr-only" for="inlineFormInput">directionsFromAddress</label>' +
          '<input type="text" class="form-control" id="directionsFromAddress"' +
          'name="directionsFromAddress" placeholder="450 Sutter, San Francisco">' +
          '<input type="hidden" id="directionsLocation" value="' + position + '">' +
          '<input type="hidden" id="directionsTitle" value="' + title + '">' +
          '<input type="hidden" id="directionsAddress" value="' + address + '">' +
        '</div><button type="submit" class="btn btn-default">Get Directions</button></form>'
      );
  }


  // http://stackoverflow.com/questions/6378007/
  // adding-event-to-element-inside-google-maps-api-infowindow
  google.maps.event.addListener(infoWindow, 'domready', function() {
    var destination = this.marker;
    $(".walkingDir").on("click", function() {
      travel = "WALKING";
    });
    $(".drivingDir").on("click", function() {
      travel = "DRIVING";
    });
    $(".directions").on("click", destination, directionsModal);
  });



  //////////////////////
  // Add to favorites //
  //////////////////////

  function addedToFavorites(result) {
    $("#pageModal").modal();
    $("#pageModalHtml").html(result);
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
    $(".addToFavTrucks").on("click", favorite, addToFavTrucks);
  });  

  google.maps.event.addListener(infoWindow, 'domready', function() {
    var favorite = this.marker;
    $(".addToFavPopos").on("click", favorite, addToFavPopos);
  });  

  google.maps.event.addListener(infoWindow, 'domready', function() { 
    var favorite = this.marker;
    $(".addToFavArt").on("click", favorite, addToFavArt);
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

    map.setZoom(15);
    map.setCenter(p1);
    var counter = 0

    for (var marker of evt.data.markers) {
      var p2 = marker.position;
      // calucate distance between in meters / divide by 1600 to get to miles
      var distance = 
          (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1600);

      // show markers within half a mile
      if (distance < 0.5) {
        marker.setVisible(true);
        counter++;
      }

      $("#numLocationsAddress").html(counter + " nearby " + evt.data.type + 
                              " within half a mile");
    }
  }


  google.maps.event.addListener(infoWindow, 'domready', function() {
    var data = {
      currentMarker: this.marker,
      markers: truckMarkers,
      type: "food trucks"
    }
    $("#nearbyTrucks").on("click", data, getNearbyMarkers);

    data = {
      currentMarker: this.marker,
      markers: poposMarkers,
      type: "POPOS"
    }
    $("#nearbyPopos").on("click", data, getNearbyMarkers);

    data = {
      currentMarker: this.marker,
      markers: artMarkers,
      type: "art locations"
    }
    $("#nearbyArt").on("click", data, getNearbyMarkers);
  });



  //////////////////////////////////////
  // Neighborhoods on hover and click //
  //////////////////////////////////////

  map.data.addListener("mouseover", function(event) {
    document.getElementById("infoBox").textContent =
        event.feature.getProperty("name");
  });

  map.data.addListener('click', function(event) {

    var allMarkers = truckMarkers.concat((poposMarkers.concat(artMarkers)));

    // show all neighborhoods and data
    if (event.feature.getProperty("selected")) {
      map.data.revertStyle();
      map.data.setStyle({
        visible: true,
        fillOpacity: 0.0,
        strokeWeight: 1
      });
      event.feature.setProperty("selected", false);

      for (var marker of allMarkers) {
        marker.setVisible(true);
      }

      // show only clicked neighborhood and data
    } else {      
      map.data.setStyle({visible: false});
      map.data.overrideStyle(event.feature, {
        visible: true,
        fillOpacity: 0.0,
        strokeWeight: 1
      });
      event.feature.setProperty("selected", true);

      var polyPath = event.feature.getGeometry().getAt(0).getAt(0).getArray();
      var polygon = new google.maps.Polygon({
        paths: polyPath
      });

      for (var marker of allMarkers) {
        var position = marker.position;

        if (google.maps.geometry.poly.containsLocation(position, polygon)) {
          marker.setVisible(true);
        } else {
          marker.setVisible(false);
        }
      }
    }
  });


  ///////////////////////
  // Search by address //
  ///////////////////////


  function geocodeResponse(data) {
    for (var addressMarker of addressMarkers) {
      addressMarker.setVisible(false);
    }

    var coords = data.results[0].geometry.location;
    var p1 = new google.maps.LatLng(coords.lat, coords.lng);

    var marker = new google.maps.Marker({
      position: p1,
      map: map
    });

    marker.setVisible(true);
    addressMarkers.unshift(marker);

    map.setCenter(coords);
    map.setZoom(15);
    var counter = 0;

    var allMarkers = truckMarkers.concat((poposMarkers.concat(artMarkers)));

    for (var marker of allMarkers) {
      var p2 = marker.position;
      // calucate distance between in meters / divide by 1600 to get to miles
      var distance = 
          (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1600);

      // show markers within half a mile
      if (distance < 0.5) {
        marker.setVisible(true);
        counter++;
      } else {
        marker.setVisible(false);
      }
    }

    $("#numLocationsAddress").html(counter + " OuterSpaces within half a mile");
    $("#numLocationsSearch").empty();
  }


  function geocodeRequest(data) {
    var search = $(".searchByAddress").val().toLowerCase().replace(/\s+/g, "+");
    $.get("https://maps.googleapis.com/maps/api/geocode/json?address=" 
      + search + "San+Francisco&key=" + data, geocodeResponse);
  }

  function showNearAddress(evt) {
    evt.preventDefault();
    infoWindow.close();
    map.data.setStyle({visible: false});

    $.get("/data/gkey", geocodeRequest);
  } 

  $("#addressForm").on("submit", showNearAddress);



  ////////////////////////////////////
  // Hide undefined in info windows //
  ////////////////////////////////////

  google.maps.event.addListener(infoWindow, 'domready', function() {
    $("p:contains('undefined')").remove();
    $("a:contains('undefined')").remove();
  });


} // end of mapHelpers()


//////////////////
// Plan My Trip //
//////////////////

function planMyTrip() {

  if (document.getElementById("plan_trip")) {

    $("#driving").on("click", function() {
      travel = "DRIVING";
      $("#displayTravelMode").html("Driving Directions")
      planMyTrip();
    });

    $("#walking").on("click", function() {
      travel = "WALKING";
      $("#displayTravelMode").html("Walking Directions")  
      planMyTrip();
    });

    $.get("/data/gkey", function(data) {

      var address = $("#identifier").val().toLowerCase().replace(/\s+/g, "+");
      
      $.get("https://maps.googleapis.com/maps/api/geocode/json?address=" 
      + address + "&key=" + data, function(data) {

        var coords = data.results[0].geometry.location;
        var p1 = new google.maps.LatLng(coords.lat, coords.lng);
    

        map.data.setStyle({visible: false});
      
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
          var distance = 
              (google.maps.geometry.spherical.computeDistanceBetween(p1, p2));
          if (!closestTruck || closestTruck.distance > distance) {
            closestTruck = {
              marker: marker,
              distance: distance
            }
          }
        }
        closestTruck.marker.setVisible(true);
        p2 = new google.maps.LatLng(closestTruck.marker.lat,
                                    closestTruck.marker.lng);


        ////////////////////////
        // plot nearest POPOS //
        ////////////////////////

        var closestPopos;

        for (var marker of poposMarkers) {
          var p3 = new google.maps.LatLng(marker.lat, marker.lng);
          var distance = 
              (google.maps.geometry.spherical.computeDistanceBetween(p2, p3));
          if (!closestPopos || closestPopos.distance > distance) {
            closestPopos = {
              marker: marker,
              distance: distance
            }
          }
        }
        closestPopos.marker.setVisible(true);
        p3 = new google.maps.LatLng(closestPopos.marker.lat, 
                                    closestPopos.marker.lng);


        //////////////////////
        // plot nearest art //
        //////////////////////

        var closestArt;

        for (var marker of artMarkers) {
          var p4 = new google.maps.LatLng(marker.lat, marker.lng);
          var distance = 
              (google.maps.geometry.spherical.computeDistanceBetween(p3, p4));
          if (!closestArt || closestArt.distance > distance) {
            closestArt = {
              marker: marker,
              distance: distance
            }
          }
        }
        closestArt.marker.setVisible(true);
        p4 = new google.maps.LatLng(closestArt.marker.lat, 
                                    closestArt.marker.lng);


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
          travelMode: google.maps.DirectionsTravelMode[travel]
        };

        // first hide the panel
        directionsDisplay.getPanel().style.visibility="hidden";
        $(".warnbox-content, .warnbox-c1, .warnbox-c2").hide();

        // set the directions
        directionsService.route(request, function (response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
          } else {
            window.alert("Directions request failed due to " + status);
          }
         });

        var displayAddress =  $("#identifier").val();

        // custom titles for directions panel
        var title = [
          "<div style='font-weight:bold;'>" + displayAddress + "</div>First, \
          Food!<br>Follow the directions below to get to the food truck nearest you.",
          "You have arrived to:<div style='font-weight:bold'>" + 
            closestTruck.marker.title + " on " + closestTruck.marker.address + 
            "</div>Next, bring your food to the nearest POPOS by following the \
            directions below.",
          "You have arrived to:<div style='font-weight:bold'>" + 
            closestPopos.marker.title + " on " + closestPopos.marker.address + 
            "</div>Lastly, follow the next set of directions to get to the \
            closest Public Art.",
          "You have arrived to:<div style='font-weight:bold'>" + 
            closestArt.marker.title + " on " + closestArt.marker.address + 
            "</div>Enjoy, you Space cadet you!"
        ]

        setTimeout(function(){
          // fetch the elements
          var nodes = 
              directionsDisplay.getPanel().querySelectorAll("td.adp-text");
          for (var n = 0; n < nodes.length; ++n) {
            // assign the text-content of the element to the innerHTML-property
            nodes[n].innerHTML = title[n];
        }
          // show the panel
          directionsDisplay.getPanel().style.visibility="visible";
        }, 500);
      });
    });
  }
}