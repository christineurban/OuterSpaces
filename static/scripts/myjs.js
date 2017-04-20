"use strict"

$(document).ready(function() {

  /////////////////////////////////////
  // Toggle log in and sign up forms //
  /////////////////////////////////////

  $("#signUpBtn").on("click", function(){
      $("#logInForm").hide();
      $("#fNameSignUp, #lNameSignUp, #emailSignUp, #pwSignUp").attr("type", "text");
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
    console.log(alpha);
    $(".hideAlpha").hide();
    $("#" + alpha).show();
    var name = $(this).html();
    $("#pageName").html(name);
  });


  // //////////////////////
  // // Flash into modal //
  // //////////////////////

  // var messages = "{{ get_flashed_messages() }}";

  // if (typeof messages != 'undefined' && messages != '[]') {
  //   console.log(messages);
  //   $("#flashModal").modal();
  // };



}); // end of $(document).ready