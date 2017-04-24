"use strict"

$(document).ready(function() {

  /////////////////////////////////////
  // Toggle log in and sign up forms //
  /////////////////////////////////////

  $("#signUpBtn").on("click", function(){
      $("#logInForm").hide();
      $("#fNameSignUp, #lNameSignUp").attr("type", "text");
      $("#emailSignUp").attr("type", "email");
      $("#pwSignUp, #pwConfirmSignUp").attr("type", "password");
      $("#submitSignUp").attr("type", "submit");
      $("#signUpBtn").prop("disabled");
      $("#logInBtn").prop("disabled", false);
  });


  $("#logInBtn").on("click", function(){
      $("#fNameSignUp, #lNameSignUp, #emailSignUp, #pwSignUp, #submitSignUp, #pwConfirmSignUp").attr("type", "hidden");
      $("#logInForm").show();
      $("#logInBtn").prop("disabled");
      $("#signUpBtn").prop("disabled", false);
  });



  /////////////////////////////////////////
  // Check if passwords match on sign up //
  /////////////////////////////////////////

  $("#pwConfirmSignUp").on("blur", function() {
    if ($("#pwConfirmSignUp").val() != $("#pwSignUp").val()) {
      $("#pwConfirmSignUp, #pwSignUp").css("border", "1px solid red");
      $("#pwWarning").html("Your passwords do not match, please re-enter.");
    } else {
      $("#pwConfirmSignUp, #pwSignUp").css("border-color", "");
      $("#pwWarning").empty();
    }
  });

  $("#pwSignUp").on("focus", function() {
    $("#pwConfirmSignUp, #pwSignUp").css("border-color", "");
    $("#pwWarning").empty();
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


  function addToFavTrucksPage(evt) {
    evt.preventDefault();

    var formInputs = {
      "name": this[0].value,
      "address": this[1].value,
      "hours": this[2].value,
      "cuisine": this[3].value,
      "lat": this[4].value,
      "lng": this[5].value
    };

    $.post("/favorite-truck", 
           formInputs,
           addedToFavsPage
           );
  }


  function addToFavPoposPage(evt) {
    evt.preventDefault();

    var formInputs = {
      "name": this[0].value,
      "address": this[1].value,
      "hours": this[2].value,
      "location": this[3].value,
      "popos_type": this[4].value,
      "year": this[5].value,
      "description": this[6].value,
      "lat": this[7].value,
      "lng": this[8].value
    };

    $.post("/favorite-popos", 
           formInputs,
           addedToFavsPage
           );
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

  $(".truckPageForm").on("submit", addToFavTrucksPage);

  $(".poposPageForm").on("submit", addToFavPoposPage);

  $(".artPageForm").on("submit", addToFavArtPage);


}); // end of $(document).ready


