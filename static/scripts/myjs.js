/////////////////
// Google Maps //
/////////////////

// Initalize map of San Francisco
function initMap() {
    var sanFrancisco = {lat: 37.7599, lng: -122.440558};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: sanFrancisco
    });

    // Retrieve food truck data and plot it
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
        }
    };

    // Retrieve POPOS data and plot it
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
        }
    };

    // Retrieve public art data and plot it
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
        }
    };


    // get food truck data from server
    $.get("/data/trucks.json",
          plotDataTrucks);

    // get POPOS data from server
    $.get("/data/popos.json",
          plotDataPopos);

    // get public art data from server
    $.get("/data/art.json",
          plotDataArt);

}

