"use strict"

$(document).ready(function() {

  /////////////////////////////////////
  // Toggle log in and sign up forms //
  /////////////////////////////////////

  $("#signUpBtn").on("click", function(){
      $("#logInForm").hide();
      $("#fNameSignUp, #lNameSignUp").attr("type", "text");
      $("#emailSignUp").attr("type", "email");
      $("#pwSignUp").attr("type", "password");
      $("#submitSignUp").attr("type", "submit");
      $("#signUpBtn").prop("disabled");
      $("#logInBtn").prop("disabled", false);
  });


  $("#logInBtn").on("click", function(){
      $("#fNameSignUp, #lNameSignUp, #emailSignUp, #pwSignUp, #submitSignUp").attr("type", "hidden");
      $("#logInForm").show();
      $("#logInBtn").prop("disabled");
      $("#signUpBtn").prop("disabled", false);
  });


  //////////////////
  // Toggle Alpha //
  //////////////////

  $(".alpha").on("click", function(){
    // removes all whitespaces and lowercases
    var alpha = $(this).html().replace(/[\s\/\.]+/g, "").toLowerCase();
    $(".hideAlpha").hide();
    $("#" + alpha).show();
    var name = $(this).html();
    $("#pageName").html(name);
  });


  ////////////////////
  // Delete account //
  ////////////////////

  $("#deleteBtnModal").on("click", function() {
    $("#deleteBtnHidden").submit();
  });

  $("#deleteAcct").on("click", function() {
    $("#deleteModal").modal();
  });


  ////////////////////////////////
  // Add To favorites from page //
  ////////////////////////////////

  function addedToFavsPage(result) {
    $("#pageModal").modal();
    $("#pageModalHtml").html(result);
  }

  function addToFavArtPage(evt) {
    evt.preventDefault();

    var formInputs = {
      "title": this[0].value,
      "address": this[1].value,
      "location": this[2].value,
      "art_type": this[3].value,
      "medium": this[4].value,
      "artist_link": this[5].value,
      "lat": this[6].value,
      "lng": this[7].value
    };

    console.log(formInputs);

    $.post("/favorite-art", 
           formInputs,
           addedToFavsPage
           );
  }

  $(".artPageForm").on("submit", addToFavArtPage);



}); // end of $(document).ready


